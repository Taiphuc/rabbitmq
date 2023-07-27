const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://ufgnebod:iSbe8vAB5Bkn8X-lERAMd-jzmn8ib0Hv@armadillo.rmq.cloudamqp.com/ufgnebod'

const sendQueue = async ({ msg }) => {
    try {
        // create conn
        const conn = await amqplib.connect(amqp_url_cloud)
        // create channel
        const channel = await conn.createChannel()
        // create name queue
        const nameQueue = 'q1'
        // create queue
        await channel.assertQueue(nameQueue, {
            // false mất hàng đợi khi dữ liệu bị crash or cloud crash
            durable: false
        })
        // send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg)) // Buffer giúp đẩy dữ liệu nhanh hơn, mã hóa dữ liệu thành byte
        // close conn and channel

    } catch (err) {
        console.log(`Err:::`, err);
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello'
sendQueue({ msg })