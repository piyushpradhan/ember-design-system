import {
  MdKeyboardCommandKey,
  MdKeyboardControlKey,
  MdKeyboardOptionKey,
  MdKeyboardArrowUp,
  MdKeyboardTab,
  MdKeyboardReturn,
  MdKeyboardBackspace,
  MdKeyboardCapslock,
  MdSpaceBar,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardHide,
} from 'react-icons/md'

const iconProps = { size: '1em' } as const

export const KbdCmd = () => <MdKeyboardCommandKey {...iconProps} />
export const KbdCtrl = () => <MdKeyboardControlKey {...iconProps} />
export const KbdOption = () => <MdKeyboardOptionKey {...iconProps} />
export const KbdShift = () => <MdKeyboardArrowUp {...iconProps} />
export const KbdTab = () => <MdKeyboardTab {...iconProps} />
export const KbdReturn = () => <MdKeyboardReturn {...iconProps} />
export const KbdBackspace = () => <MdKeyboardBackspace {...iconProps} />
export const KbdCapslock = () => <MdKeyboardCapslock {...iconProps} />
export const KbdSpace = () => <MdSpaceBar {...iconProps} />
export const KbdArrowUp = () => <MdKeyboardArrowUp {...iconProps} />
export const KbdArrowDown = () => <MdKeyboardArrowDown {...iconProps} />
export const KbdArrowLeft = () => <MdKeyboardArrowLeft {...iconProps} />
export const KbdArrowRight = () => <MdKeyboardArrowRight {...iconProps} />
export const KbdEscape = () => <MdKeyboardHide {...iconProps} />
