import { useReward } from "react-rewards";

export default function Dashboard() {
  const { reward, isAnimating } = useReward("rewardId", "emoji", {
    emoji: ["📑", "🧾", "📖"],
  });

  return (
    <>
      <button disabled={isAnimating} onClick={reward}>
        <span id="rewardId" />
        🎉
      </button>
    </>
  );
}
