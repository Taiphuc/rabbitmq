const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://ufgnebod:iSbe8vAB5Bkn8X-lERAMd-jzmn8ib0Hv@armadillo.rmq.cloudamqp.com/ufgnebod'

// pubsub là mô hình producer ko gửi tin nhắn trực tiếp đến consumer mà gửi đến exchange để exchange phân bổ đến các consumer
const receiveNoti = async () => {
    try {
        // create conn
        const conn = await amqplib.connect(amqp_url_cloud)
        // create channel
        const channel = await conn.createChannel()
        //create name exchange
        const nameExchange = 'video'
        // create exchange
        await channel.assertExchange(nameExchange, 'fanout', {
            durable: true
        })
        // create queue
        // name queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true // nếu đã sub nhưng exit thì nó sẽ ko gửi nữa
        }) 
        console.log(`nameQueue::`, queue);
        // binding mối quan hệ giữa exchange và queue
        await channel.bindQueue(queue, nameExchange, '')
        await channel.consume(queue, msg => {
            console.log(`msg: `, msg.content.toString());
        }, {
            noAck: true
        })
    } catch (err) {
        console.log(`Err:::`, err);
    }
}

receiveNoti()