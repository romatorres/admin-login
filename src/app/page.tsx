import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link href="/login">
        <Button className="cursor-pointer">Faça o Login</Button>
      </Link>
    </div>
  );
}
