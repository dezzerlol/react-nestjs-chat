import React from 'react'

type AvatarSizes = 'xs' | 'sm' | 'md' | 'lg'

type RoundedSizes = 'sm' | 'md' | 'full'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string | null
  alt: string
  size?: AvatarSizes
  rounded?: RoundedSizes
  className?: React.ComponentProps<'div'>['className']
}

const sizeMap: Record<AvatarSizes, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const roundesSizesMap: Record<RoundedSizes, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  full: 'rounded-full',
}

const defaultAvatarSrc = '/images/user.png'

export const Avatar = ({ alt, src, size = 'sm', rounded = 'full', className = '', ...props }: AvatarProps) => {
  return (
    <div className={`${sizeMap[size]} `} {...props}>
      <img
        src={src ? src : defaultAvatarSrc}
        alt={alt}
        className={`${roundesSizesMap[rounded]} ${className} h-full w-full`}
      />
    </div>
  )
}
