const sizeClasses = {
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-11 h-11 text-sm',
} as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({
  name,
  imageUrl,
  size = 'md',
  className = '',
}: {
  name: string;
  imageUrl?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
