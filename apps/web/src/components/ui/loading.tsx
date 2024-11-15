import { GiftIcon } from "@heroicons/react/24/solid";

export default function LoadingPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white overflow-hidden"
      style={{ position: "relative" }}
    >
      <div
        style={{
          animation: "bounceSides 3s ease-in-out infinite",
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GiftIcon className="h-16 w-16 text-red-700" />
      </div>

      <style jsx>{`
        @keyframes bounceSides {
          0% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(25vw) translateY(-30px);
          }
          50% {
            transform: translateX(50vw) translateY(0);
          }
          75% {
            transform: translateX(75vw) translateY(-30px);
          }
          100% {
            transform: translateX(100vw) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
