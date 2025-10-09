import type { FC, ReactNode } from 'react'
import { motion, type Transition as ITransition } from 'framer-motion'
import type { TransitionType } from '@/constant/transitions'
import { transitions, defaultTransitionConfig } from '@/constant/transitions'

export type PageTransitionProps = {
  children: ReactNode
  type?: TransitionType
  className?: string
  transition?: ITransition
  exitAnimation?: boolean
}

const Transition: FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  className = '',
  transition,
  exitAnimation = false
}) => {
  const variants = transitions[type]
  const exitConfig = exitAnimation ? { exit: 'exit' } : {}
  const transitionConfig = transition || defaultTransitionConfig

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      {...exitConfig}
      transition={transitionConfig}
    >
      {children}
    </motion.div>
  )
}

export default Transition
