import { Feature } from "@/lib/data";

export function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-lg border bg-white p-5 shadow-soft lg:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-secondary lg:h-12 lg:w-12">
        <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold lg:text-xl">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
        {feature.description}
      </p>
    </article>
  );
}
