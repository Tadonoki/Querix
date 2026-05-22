import { ArrowRight } from "lucide-react";
import { LoadingLinkButton } from "@/components/loading-link-button";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { InteractivePreview } from "@/components/landing/interactive-preview";
import { LearningPathPreview } from "@/components/landing/learning-path-preview";
import { landingFeatures } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <section className="bg-white py-16 lg:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary lg:text-base">
              Kenapa Querix
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-primary lg:text-4xl">
              Belajar SQL tanpa rasa takut coding
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:mt-10 lg:gap-6">
            {landingFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-querix-paper py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary lg:text-base">
                Alur Belajar
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-primary lg:text-4xl">
                Mulai dari konsep paling dasar
              </h2>
            </div>
            <LoadingLinkButton
              href="/learn"
              variant="outline"
              loadingText="Memuat materi..."
            >
              Lihat Materi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LoadingLinkButton>
          </div>
          <LearningPathPreview />
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container">
          <div className="mb-8 max-w-3xl lg:mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary lg:text-base">
              Preview Interaktif
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-primary lg:text-4xl">
              Tulis query, lihat hasilnya langsung
            </h2>
          </div>
          <InteractivePreview />
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground lg:py-20">
        <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-200 lg:text-base">
              Siap mulai ngulik data?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal lg:text-4xl">
              Mulai latihan SQL pertamamu hari ini.
            </h2>
          </div>
          <LoadingLinkButton
            href="/learn"
            variant="accent"
            size="lg"
            loadingText="Memuat..."
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LoadingLinkButton>
        </div>
      </section>
    </main>
  );
}
