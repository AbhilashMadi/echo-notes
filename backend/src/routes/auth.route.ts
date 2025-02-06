import { Hono } from "hono";

const useRouter = new Hono();

useRouter.get("/", (c) => {
  return c.json({ res: "from auth route" })
})

export default useRouter;