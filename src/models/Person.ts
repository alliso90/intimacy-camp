import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
  // Basic Information
  firstName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    maxlength: 50 
  },
  lastName: { 
    type: String, 
    required: true, 
    minlength: 2, 
    maxlength: 50 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true, 
    maxlength: 500 
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['male', 'female'] 
  },
  maritalStatus: { 
    type: String, 
    required: true, 
    enum: ['single', 'engaged', 'married'] 
  },
  
  // Role Information
  isLeader: { 
    type: String, 
    required: true, 
    enum: ['yes', 'no'] 
  },
  ministry: { 
    type: String, 
    required: function(this: any) { 
      return this.isLeader === 'yes'; 
    } 
  },
  customMinistry: { 
    type: String, 
    required: function(this: any) { 
      return this.isLeader === 'yes' && this.ministry === 'other'; 
    } 
  },
  
  // Type and Registration
  type: { 
    type: String, 
    required: true, 
    enum: ['participant', 'volunteer', 'staff'],
    default: 'participant'
  },
  
  // Volunteer-specific fields
  departments: { 
    type: [String], 
    required: function(this: any) {
      return this.type === 'volunteer';
    },
    validate: {
      validator: function(v: string[]) {
        if (this.type !== 'volunteer') return true;
        return v.length > 0 && v.length <= 2;
      },
      message: 'Volunteers must select 1-2 departments'
    }
  },
  
  // Registration Information
  registrationCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isConfirmed: { 
    type: Boolean, 
    default: true 
  },
  emailSent: { 
    type: Boolean, 
    default: false 
  },
  
  // Status Information
  status: { 
    type: String, 
    enum: ['pending', 'active', 'cancelled'],
    default: 'active'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'free'],
    default: 'pending'
  },
  checkInStatus: { 
    type: Boolean, 
    default: false 
  },
  checkInTime: { 
    type: Date 
  },
  
  // Metadata
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  notes: { 
    type: String, 
    maxlength: 1000 
  }
}, {
  timestamps: true
});

// Indexes for better performance
PersonSchema.index({ email: 1 }, { unique: true });
PersonSchema.index({ registrationCode: 1 }, { unique: true });
PersonSchema.index({ type: 1 });
PersonSchema.index({ isConfirmed: 1 });
PersonSchema.index({ checkInStatus: 1 });
PersonSchema.index({ createdAt: -1 });
PersonSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Update the updatedAt timestamp before saving
PersonSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Person = mongoose.models.Person || mongoose.model('Person', PersonSchema);

export default Person;