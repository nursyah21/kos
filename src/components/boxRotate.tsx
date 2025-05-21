import * as motion from 'motion/react-client'

const size = 50
const backgroundColor = '#777777'
const borderRadius = 5

export default function BoxRotate() {
    return (
        <motion.div
            style={{
                width: size, height: size, backgroundColor, borderRadius
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    )
}