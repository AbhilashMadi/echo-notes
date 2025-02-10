import type { Context, MiddlewareHandler, Next } from "hono";
import type { infer as ZodInfer, ZodSchema } from "zod";

// Extend Hono's Context to include validated data
type ValidatedContext<B, Q, P> = Context<{
  Variables: {
    validatedBody?: B;
    validatedQuery?: Q;
    validatedParams?: P;
  };
}>;

// Middleware for validating request body, query, and params
function validateRequest<
  B extends ZodSchema | undefined = undefined,
  Q extends ZodSchema | undefined = undefined,
  P extends ZodSchema | undefined = undefined,
>(bodySchema?: B, querySchema?: Q, paramsSchema?: P): MiddlewareHandler {
  return async (c: ValidatedContext<
    B extends ZodSchema ? ZodInfer<B> : undefined,
    Q extends ZodSchema ? ZodInfer<Q> : undefined,
    P extends ZodSchema ? ZodInfer<P> : undefined
  >, next: Next) => {
    if (bodySchema) {
      bodySchema.parse(await c.req.json());
    }

    // Validate query parameters
    if (querySchema) {
      querySchema.parse(c.req.query());
    }

    // Validate route parameters
    if (paramsSchema) {
      paramsSchema.parse(c.req.param());
    }

    return await next();
  };
}

export default validateRequest;
