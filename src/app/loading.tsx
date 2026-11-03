import { PageLoadingPanel } from "@/components/shared/PageLoadingPanel";

export default function Loading() {
  return (
    <div className="min-h-screen h-dvh w-full bg-[#fcfbfa] dark:bg-[#150f0b] flex items-center justify-center p-4">
      <PageLoadingPanel />
    </div>
  );
}
