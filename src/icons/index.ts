import { defineComponent, h } from 'vue'
import annoyed from './annoyed.svg?raw'
import bath from './bath.svg?raw'
import chevronsDown from './chevrons-down.svg?raw'
import clock from './clock.svg?raw'
import doorOpen from './door-open.svg?raw'
import frown from './frown.svg?raw'
import house from './house.svg?raw'
import IconGlyph from './IconGlyph.vue'
import meh from './meh.svg?raw'
import moon from './moon.svg?raw'
import showerHead from './shower-head.svg?raw'
import smile from './smile.svg?raw'
import sun from './sun.svg?raw'

function glyph(source: string) {
  return defineComponent({
    props: {
      size: { type: Number, default: 24 },
      strokeWidth: { type: Number, default: 2 },
    },
    setup(props, { attrs }) {
      return () =>
        h(IconGlyph, {
          ...attrs,
          source,
          size: props.size,
          strokeWidth: props.strokeWidth,
        })
    },
  })
}

export const Annoyed = glyph(annoyed)
export const Bath = glyph(bath)
export const ChevronsDown = glyph(chevronsDown)
export const Clock = glyph(clock)
export const DoorOpen = glyph(doorOpen)
export const Frown = glyph(frown)
export const House = glyph(house)
export const Meh = glyph(meh)
export const Moon = glyph(moon)
export const ShowerHead = glyph(showerHead)
export const Smile = glyph(smile)
export const Sun = glyph(sun)
