const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://ufgnebod:iSbe8vAB5Bkn8X-lERAMd-jzmn8ib0Hv@armadillo.rmq.cloudamqp.com/ufgnebod'

// pubsub là mô hình producer ko gửi tin nhắn trực tiếp đến consumer mà gửi đến exchange để exchange phân bổ đến các consumer
const receiveEmail = async () => {
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

        // create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true // nếu đã sub nhưng exit thì nó sẽ ko gửi nữa
        })

        // binding mối quan hệ giữa exchange và queue
        /*
            * phù hợ với bất kỳ từ nào
            # khớp với 1 or nhiều từ bất kỳ 
        */
        const args = process.argv.slice(2)
        if (!args.length) {
            process.exit(0)
        }
        console.log(`Waiting queue ${queue}, topic ${args}`);
        args.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key)
        })

        await channel.consume(queue, msg => {
            console.log(`Routing key: ${msg.fields.routingKey}, msg: ${msg.content.toString()}`);
        }, {
            noAck: true
        })
    } catch (err) {
        console.log(`Err:::`, err);
    }
}

receiveEmail()