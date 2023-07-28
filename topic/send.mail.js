const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://ufgnebod:iSbe8vAB5Bkn8X-lERAMd-jzmn8ib0Hv@armadillo.rmq.cloudamqp.com/ufgnebod'

// pubsub là mô hình producer ko gửi tin nhắn trực tiếp đến consumer mà gửi đến exchange để exchange phân bổ đến các consumer
const sendEmail = async () => {
    try {
        // create conn
        const conn = await amqplib.connect(amqp_url_cloud)
        // create channel
        const channel = await conn.createChannel()
        //create name exchange
        const nameExchange = 'send_email'
        // create exchange
        await channel.assertExchange(nameExchange, 'topic', {
            durable: true
        })

        const args = process.argv.slice(2)
        const msg = args[1] || 'Fixed!'
        const topic = args[0]
        console.log(`msg:::${msg}, topic:::${topic}`);

        // publish email
        await channel.publish(nameExchange, topic, Buffer.from(msg))
        console.log(`Send Ok`);

        setTimeout(() => {
            conn.close()
            process.exit(0)
        }, 2000)
    } catch (err) {
        console.log(`Err:::`, err);
    }
}

sendEmail()