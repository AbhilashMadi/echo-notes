import { TextLoop } from "@/components/custom/text-loop";

export function AnimatedUseCases() {
  return (
    <p className="text-5xl font-ternary">
      Take notes effortlessly with{" "}
      <div className="font-semibold">
        <TextLoop
          className="overflow-y-clip"
          transition={{
            type: "spring",
            stiffness: 900,
            damping: 80,
            mass: 10,
          }}
          variants={{
            initial: {
              y: 20,
              rotateX: 90,
              opacity: 0,
              filter: "blur(4px)",
            },
            animate: {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
            },
            exit: {
              y: -20,
              rotateX: -90,
              opacity: 0,
              filter: "blur(4px)",
            },
          }}
        >
          <span>Voice Commands</span>
          <span>Markdown Formatting</span>
          <span>AI Summarization</span>
          <span>Auto-Sync Across Devices</span>
        </TextLoop>
      </div>
    </p>
  );
}
