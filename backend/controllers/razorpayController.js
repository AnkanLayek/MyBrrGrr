const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay_key_id = process.env.RAZORPAY_KEY_ID
const razorpay_key_secret = process.env.RAZORPAY_KEY_SECRET

class razorpayController {
    async createPaymentOrder(req, res){
        try {
            const { amount } = req.body;
            const razorpay = new Razorpay({
                key_id: razorpay_key_id,
                key_secret: razorpay_key_secret
            });

            const options = {
                amount: amount*100,
                currency: 'INR',
                receipt: 'receipt_' + Date.now()
            };

            const paymentOrder = await razorpay.orders.create(options);

            if(paymentOrder){
                return res.status(200).json({message: "Payment order created successfully", paymentOrder});
            }

            return res.status(500).json({message: "Failed to create the payment order"});

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }

    async verifyPayment(req, res) {
        try {
            const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

            const generated_signature = crypto
                .createHmac("sha256", razorpay_key_secret)
                .update(orderCreationId + "|" + razorpayPaymentId)
                .digest("hex");
            
            if(generated_signature == razorpaySignature) {
                return res.status(200).json({message: "Payment verified successfully"});
            }

            return res.status(400).json({message: "Payment verification failed"});

        } catch (error) {
            return res.status(500).json({message: "Internal server error", error: error})    // 500: Internal server error
        }
    }
}

module.exports = new razorpayController();