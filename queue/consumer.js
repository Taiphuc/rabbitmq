const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://ufgnebod:iSbe8vAB5Bkn8X-lERAMd-jzmn8ib0Hv@armadillo.rmq.cloudamqp.com/ufgnebod'

const receiveQueue = async () => {
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
            // true ko mất dữ liệu khi start lại
            durable: true
        })
        // receive to queue
        await channel.consume(nameQueue, msg => {
            console.log(`Message:::`, msg.content.toString());
        }, {
            noAck: true // xác nhận xử lý hay chưa
        })
        // close conn and channel

    } catch (err) {
        console.log(`Err:::`, err);
    }
}

receiveQueue()