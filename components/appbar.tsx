type AppbarProps = {
  children: React.ReactNode;
  
}

export function Appbar(props: AppbarProps) {
  const { children } = props;

  return (
    <div className="sticky bg-background top-0 z-50 flex items-center space-x-4 px-4 py-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
      {children}
      </div>
      
    </div>
  )
}
