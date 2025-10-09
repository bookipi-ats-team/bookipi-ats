import type { Variants, Transition } from 'framer-motion'

export type TransitionType =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'scale'
  | 'rotate'
  | 'flip'

export const transitions: Record<TransitionType, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  'slide-left': {
    initial: { x: '100%', opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1,
        delay: 0
      }
    },
    exit: { x: '-100%', opacity: 0 }
  },
  'slide-right': {
    initial: { x: '-100%', opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1,
        delay: 0
      }
    },
    exit: { x: '100%', opacity: 0 }
  },
  'slide-up': {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  },
  'slide-down': {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },
  rotate: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 180, opacity: 0 }
  },
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 }
  }
}

export const defaultTransitionConfig = {
  duration: 0.5,
  ease: 'easeInOut'
} as Transition
