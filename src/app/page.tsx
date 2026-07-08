import { redirect } from "next/navigation";

// Landing page (/) is built separately (landing-page-spec.md). For now redirect
// to the app so the demo has a single entry point.
export default function Home() {
  redirect("/app");
}
