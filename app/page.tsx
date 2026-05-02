export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
      <section className="card w-full max-w-2xl bg-base-200 shadow-xl">
        <div className="card-body gap-4">
          <h1 className="card-title text-2xl">EmotionLens</h1>
          <p className="text-base text-base-content/80">
            ビデオ会議中の声と表情を解析し、感情の変化をリアルタイムに通知する基盤を構築中です。
          </p>
          <div className="badge badge-info">Issue #1 基盤構築</div>
        </div>
      </section>
    </main>
  );
}
