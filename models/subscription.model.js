import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [2, 'Subscription name must be at least 2 characters long'],
        maxLength: [100, 'Subscription name must be at most 100 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price must be at least 0']
    },
    currency: {
        type: String,
        enum: ['ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
        default: 'ZAR'
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
        default: 'monthly'
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: [true, 'Subscription category is required'],
        default: 'other'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'paused', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Associated user is required'],
        index: true
    }
}, { timestamps: true });

// Auto-calculate renewalDate if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        // Jan 1st
        // Monthly
        // 30 days later -> Jan 31st
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status if renewalDate has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;