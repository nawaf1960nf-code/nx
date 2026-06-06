import { Megaphone, Globe2, Users, Wallet, BookOpen, type LucideProps } from "lucide-react";

/**
 * Resolves a subject's `icon` name (lucide-react) to a real SVG component, so
 * every subject uses the same icon set at one consistent size/stroke instead of
 * mismatched emoji. Falls back to BookOpen for unknown names.
 */
const MAP: Record<string, React.ComponentType<LucideProps>> = {
  Megaphone,
  Globe2,
  Users,
  Wallet,
  BookOpen,
};

export function SubjectIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = MAP[name] ?? BookOpen;
  return <Icon className={className} aria-hidden />;
}
