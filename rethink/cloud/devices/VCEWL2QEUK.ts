import HADevice from './base'
import { Enum } from '@/util/enum'
import { Device as Thinq2Device } from '../thinq2/device'
import { tombstone, type Connection } from '../homeassistant'
import { type Metadata } from '../thinq'
import { allowExtendedType } from '@/util/casting'
import AABBDevice from './aabb_device'
import { ERRORS, STATES } from './washer_common'

const COURSES = Enum.of({
    'Not Specified': 404,
    'Bed Sheets': 1,
    'Towels': 2,
    'Cotton': 3,
    'Delicate': 4,
    'Sleeves': 5,
    'AI Wash': 6,
    'Quick 14': 7,
    'Bedding': 8,
    'Wool/Hand': 9,
    'Down Jacket': 10,
    'Tub Clean': 11,
    'Rinse + Spin': 12,
    'Syntetic': 13,
    'Spin Only': 14,
    'Mix': 15,
    'Eco 40-60': 16,
    'Turbowash 39': 17,
});
const TEMPERATURES = Enum.of({
    'Not specified': 404,
    'Cold': 0,
    '20°C': 1,
    '30°C': 2,
    '40°C': 3,
    '60°C': 4,
    '90°C': 5,
})

const SPINS = Enum.of({
    'Not specified': 404,
    'No spin': 0,
    '400 rpm': 1,
    '800 rpm': 2,
    '1000 rpm': 3,
    '1200 rpm': 4,
    '1400 rpm': 5,
})

const RINSES = Enum.of({
    'Not specified': 404,
    'No rinse': 0,
    'Rinse': 1,
    'Rinse+': 2,
    'Rinse++': 3,
    'Rinse + Hold': 4,
    'Rinse+ + Hold': 5,
});

const SOIL_LEVELS = Enum.of({
    'Not specified': 404,
    'Light': 0,
    'Medium': 1,
    'Heavy': 2,
})

const TEMP_CODES = Enum.of({
    404: 0xFF,
    0: 0x08,
    1: 0x01,
    2: 0x02,
    3: 0x03,
    4: 0x05,
    5: 0x06,
});
const SPIN_CODES = Enum.of({
    404: 0xFF,
    0: 0x00,
    1: 0x01,
    2: 0x04,
    3: 0x06,
    4: 0x08,
    5: 0x09,
});
const RINSE_CODES = Enum.of({
    404: 0xFF,
    0: 0x00,
    1: 0x0E,
    2: 0x0F,
    3: 0x10,
    4: 0x12,
    5: 0x13,
});
const SOIL_CODES = Enum.of({
    404: 0xFF,
    0: 0x01,
    1: 0x03,
    2: 0x05,
});
const COURSE_CODES = Enum.of({
    404: 0x00,
    1: 0x81,
    2: 0x54,
    3: 0x2E,
    4: 0x16,
    5: 0xA9,
    6: 0x72,
    7: 0x4B,
    8: 0x1B,
    9: 0x5E,
    10: 0x73,
    11: 0x55,
    12: 0x37,
    13: 0x1D,
    14: 0x4E,
    15: 0x2B,
    16: 0x13,
    17: 0x7A,
});
export default class Device extends AABBDevice {
    constructor(HA: Connection, thinq: Thinq2Device, meta: Metadata) {
        super(HA, thinq, false)
        this.setConfig(
            allowExtendedType({
                ...HADevice.config(meta, { name: 'LG Washer' }),
                components: {
                    power: {
                        platform: 'switch',
                        unique_id: '$deviceid-power',
                        state_topic: '$this/power',
                        command_topic: '$this/power/set',
                        name: '',
                        icon: 'mdi:washing-machine',
                    },
                    start: {
                        platform: 'button',
                        unique_id: '$deviceid-start',
                        command_topic: '$this/start/set',
                        payload_press: '',
                        name: 'Start',
                        icon: 'mdi:play-circle-outline',
                    },
                    pause: {
                        platform: 'button',
                        unique_id: '$deviceid-pause',
                        command_topic: '$this/pause/set',
                        payload_press: '',
                        name: 'Pause',
                        icon: 'mdi:pause-circle-outline',
                    },
                    status: {
                        platform: 'sensor',
                        unique_id: '$deviceid-status',
                        state_topic: '$this/status',
                        name: 'Status',
                        icon: 'mdi:state-machine',
                        device_class: 'enum',
                        options: STATES.options,
                    },
                    error: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-error',
                        state_topic: '$this/error',
                        name: 'Error',
                        icon: 'mdi:check-circle',
                        device_class: 'problem',
                        entity_category: 'diagnostic',
                    },
                    error_message: {
                        platform: 'sensor',
                        unique_id: '$deviceid-error-message',
                        state_topic: '$this/error_message',
                        name: 'Error message',
                        icon: 'mdi:alert-circle-outline',
                        device_class: 'enum',
                        entity_category: 'diagnostic',
                        options: ERRORS.options,
                    },
                    course: {
                        platform: 'sensor',
                        unique_id: '$deviceid-course',
                        state_topic: '$this/course',
                        name: 'Course',
                        icon: 'mdi:pin-outline',
                    },
                    temp: {
                        platform: 'sensor',
                        unique_id: '$deviceid-temp',
                        state_topic: '$this/temp',
                        name: 'Temperature',
                        device_class: 'enum',
                        options: TEMPERATURES.options,
                    },
                    spin: {
                        platform: 'sensor',
                        unique_id: '$deviceid-spin',
                        state_topic: '$this/spin',
                        name: 'Spin',
                        icon: 'mdi:autorenew',
                        device_class: 'enum',
                        options: SPINS.options,
                    },
                    cycles: {
                        platform: 'sensor',
                        unique_id: '$deviceid-cycles',
                        state_topic: '$this/cycles',
                        name: 'Cycle count',
                        icon: 'mdi:counter',
                    },
                    remote_start: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-remote_start',
                        state_topic: '$this/remote_start',
                        name: 'Remote start',
                        icon: 'mdi:play-circle-outline',
                    },
                    door_lock: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-door_lock',
                        state_topic: '$this/door_lock',
                        name: 'Door lock',
                        device_class: 'lock',
                    },
                    child_lock: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-child_lock',
                        state_topic: '$this/child_lock',
                        name: 'Child lock',
                        device_class: 'lock',
                    },
                    energy: {
                        platform: 'sensor',
                        unique_id: '$deviceid-energy',
                        state_topic: '$this/energy',
                        name: 'Energy',
                        icon: 'mdi:lightning-bolt',
                        device_class: 'energy',
                        state_class: 'total_increasing',
                        unit_of_measurement: 'Wh',
                    },
                    initial_time: {
                        platform: 'sensor',
                        unique_id: '$deviceid-initial_time',
                        state_topic: '$this/initial_time',
                        device_class: 'duration',
                        unit_of_measurement: 'min',
                        name: 'Initial time',
                    },
                    remaining_time: {
                        platform: 'sensor',
                        unique_id: '$deviceid-remaining_time',
                        state_topic: '$this/remaining_time',
                        device_class: 'duration',
                        unit_of_measurement: 'min',
                        name: 'Remaining time',
                    },
                    reserve_time: {
                        platform: 'sensor',
                        unique_id: '$deviceid-reserve_time',
                        state_topic: '$this/reserve_time',
                        device_class: 'duration',
                        unit_of_measurement: 'h',
                        name: 'Reserve time',
                        icon: 'mdi:timer-sand',
                    },
                    rinse: {
                        platform: 'sensor',
                        unique_id: '$deviceid-rinse',
                        state_topic: '$this/rinse',
                        name: 'Rinse',
                        icon: 'mdi:water',
                        device_class: 'enum',
                        options: RINSES.options,
                    },
                    extra_rinse: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-extra_rinse',
                        state_topic: '$this/extra_rinse',
                        name: 'Extra rinse',
                        icon: 'mdi:water-plus',
                    },
                    turbowash: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-turbowash',
                        state_topic: '$this/turbowash',
                        name: 'TurboWash',
                        icon: 'mdi:rocket-launch',
                    },
                    prewash: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-prewash',
                        state_topic: '$this/prewash',
                        name: 'Pre-wash',
                        icon: 'mdi:water-sync',
                    },
                    soil: {
                        platform: 'sensor',
                        unique_id: '$deviceid-soil',
                        state_topic: '$this/soil',
                        name: 'Soil level',
                        icon: 'mdi:washing-machine',
                        device_class: 'enum',
                        options: SOIL_LEVELS.options,
                    },
                    intensive_wash: tombstone('binary_sensor'),
                    steam: {
                        platform: 'binary_sensor',
                        unique_id: '$deviceid-steam',
                        state_topic: '$this/steam',
                        name: 'Steam',
                        icon: 'mdi:kettle-steam',
                    },
                },
            }),
        )
    }

    start() {
        this.send(Buffer.from('F0ED1121010000001800', 'hex'))
    }
    processAABB(buf: Buffer) {
        const bufLength = buf.length
        const programPacketLengths = [87, 89]
        const powerPacketLengths = [14, 15]
        const infoPacketLengths = [142]
        if (bufLength === 80 && buf[0] == 0x20) {
            console.log('[DEBUG] Old packet')
            console.log('[DEBUG][OLD] Length', buf.length)
            const time_remain = buf[44] * 60 + buf[45]
            const time_initial = buf[46] * 60 + buf[47]
            const course = buf[48]
            const error = buf[49]
            const soil = buf[50]
            const spin = buf[51]
            const temp = buf[52]
            const extra_rinse = buf[53]
            const time_reserve_hour = buf[55]
            const options = buf[57]
            const lock_status = buf[58]
            const cycles = buf[64]
            const energy = buf[71] * 256 + buf[72]

            this.publishProperty('error_message', ERRORS.map(error)) // publish message before set error state
            this.publishProperty('error', error ? 'ON' : 'OFF')
            this.publishProperty('course', COURSES.map(course))
            this.publishProperty('spin', SPINS.map(spin))
            this.publishProperty('temp', TEMPERATURES.map(temp))
            this.publishProperty('cycles', cycles)
            this.publishProperty('remote_start', lock_status & 2 ? 'ON' : 'OFF')
            this.publishProperty('door_lock', !(lock_status & 0x40) ? 'ON' : 'OFF') // inverted logic, off=locked
            this.publishProperty('child_lock', !(lock_status & 0x80) ? 'ON' : 'OFF') // inverted logic, off=locked
            this.publishProperty('initial_time', time_initial)
            this.publishProperty('remaining_time', time_remain)
            this.publishProperty('reserve_time', time_reserve_hour)
            this.publishProperty('energy', energy)
            this.publishProperty('extra_rinse', extra_rinse >= 2 ? 'ON' : 'OFF') // 0/1=off, 2+=one or more extra rinses (Rinse+)
            this.publishProperty('turbowash', options & 0x01 ? 'ON' : 'OFF')
            this.publishProperty('prewash', options & 0x40 ? 'ON' : 'OFF')
            this.publishProperty('steam', options & 0x80 ? 'ON' : 'OFF')
            this.publishProperty('soil', SOIL_LEVELS.map(soil))
        } else if (powerPacketLengths.includes(bufLength) && buf[0] == 0x20) {
            console.log('[DEBUG] Power packet', buf.toString('hex'))
            const power_code = buf[9]
            if (power_code !== 0x00) {
                if (power_code === 0x01) {
                    this.publishProperty('power', 'ON')
                } else {
                    this.publishProperty('power', 'OFF')
                }

            }
        } else if (programPacketLengths.includes(bufLength) && buf[0] === 0x20) {
            console.log('[DEBUG] Program Packet', buf.toString('hex'))
            const offset = bufLength === programPacketLengths[0] ? 0 : 2
            const course_byte = 28
            const spin_byte = 27
            const rinse_byte = 26
            const temp_byte = 25
            const soil_byte = 24
            const vapor_byte = 58
            const turbowash_n_prewash_byte = 57
            const course_code = buf[course_byte + offset]
            const spin_code = buf[spin_byte + offset]
            const rinse_code = buf[rinse_byte + offset]
            const temp_code = buf[temp_byte + offset]
            const soil_code = buf[soil_byte + offset]
            const vapor_code = buf[vapor_byte + offset]
            const turbowash_n_prewash_code = buf[turbowash_n_prewash_byte + offset]
            const course_index = Number(COURSE_CODES.map(course_code))
            const spin_index = Number(SPIN_CODES.map(spin_code))
            const rinse_index = Number(RINSE_CODES.map(rinse_code))
            const temp_index = Number(TEMP_CODES.map(temp_code))
            const soil_index = Number(SOIL_CODES.map(soil_code))
            this.publishProperty('steam', vapor_code === 0x10 ? 'ON' : 'OFF')
            this.publishProperty('course', COURSES.map(course_index))
            this.publishProperty('spin', SPINS.map(spin_index))
            this.publishProperty('rinse', RINSES.map(rinse_index))
            this.publishProperty('temp', TEMPERATURES.map(temp_index))
            this.publishProperty('soil', SOIL_LEVELS.map(soil_index))
            if (turbowash_n_prewash_code !== 0x00) {
                if (turbowash_n_prewash_code === 0x20) {
                    this.publishProperty('turbowash', 'ON')
                    this.publishProperty('prewash', 'OFF')
                }
                else if (turbowash_n_prewash_code === 0x40) {
                    this.publishProperty('turbowash', 'OFF')
                    this.publishProperty('prewash', 'ON')
                }
                else {
                    this.publishProperty('turbowash', 'ON')
                    this.publishProperty('prewash', 'ON')
                }
            }
            else {
                this.publishProperty('turbowash', 'OFF')
                this.publishProperty('prewash', 'OFF')
            }

        } else if (infoPacketLengths.includes(bufLength) && buf[0] == 0x20) {
            console.log('[DEBUG] Packet containing Infos', buf.toString('hex'))
            console.log('[DEBUG][INFO] Length', bufLength)
        } else {
            console.log('[DEBUG] Unknown AABB packet for washer', buf.toString('hex'))
            console.log('[DEBUG][UNKNOWN] Length', bufLength)
        }
        console.log('[DEBUG] Published properties:', this.publishCache)
    }

    setProperty(prop: string, mqttValue: string) {
        // AA08F0A1010011BB what I send for power on
        // AA0DF0E5000201FF010200C4BB what I send for power off
        // AA09F0240101009CBB what is sent for power off
        // AA08F02A010098BB what is sent for power on
        if (prop === 'power') {
            if (mqttValue === 'ON') {
                this.send(Buffer.from('F0A10100', 'hex'))
            } else if (mqttValue === 'OFF') {
                this.send(Buffer.from('F0E5000201FF010200', 'hex'))
            }
        }

        if (prop === 'pause') this.send(Buffer.from('F024040100', 'hex'))
        if (prop === 'start') this.send(Buffer.from(mqttValue || 'F024050100', 'hex'))
    }
}
