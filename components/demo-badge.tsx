export const DemoBadge = ({ label }: { label: string }) => {
  return (
    <span className="px-2 py-0.5 rounded-full border text-xs font-bold bg-orange-100 border-orange-200 text-orange-500 dark:bg-orange-100/10 dark:border-orange-200/10">
      {label}
    </span>
  );
};
