import { StackIcons } from "./constants";
import type { StackName } from "./constants";
type StackTagsProps = { tags: readonly StackName[] };

function StackTags({ tags }: StackTagsProps) {
  return (
    <ul aria-label="Tecnologias do projeto" className="mt-4.5 flex list-none flex-wrap gap-1.5 p-0">
      {tags.map((tag) => {
        const Icon = StackIcons[tag];
        return (
          <li key={tag} className="inline-flex items-center gap-1.5 rounded-tag-list border border-current px-2.25 py-1.25 font-mono text-type-caption leading-natural opacity-80">
            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
            {tag}
          </li>
        );
      })}
    </ul>
  );
}

export { StackTags };
