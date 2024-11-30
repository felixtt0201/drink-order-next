import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 flex justify-around py-3 z-50 text-white text-center">
      <Link href="/" className="w-full">
        菜單
      </Link>
      <Link href="/statistics" className="w-full">
        統計
      </Link>
      <Link href="/manage" className="w-full">
        管理
      </Link>
    </div>
  );
}
