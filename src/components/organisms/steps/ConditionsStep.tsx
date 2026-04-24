import React, { useState } from 'react';
import { FiCalendar, FiUsers, FiPlus, FiX, FiUser, FiGift, FiClock, FiLink, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ConditionsStepProps } from '@/types/capsule';

const ConditionsStep = ({
    formData,
    handleChange,
    setConditionType,
    addWitness,
    removeWitness,
    errors
}: ConditionsStepProps) => {
    const [newWitness, setNewWitness] = useState({
        name: '',
        email: ''
    });

    const handleAddWitness = (e: React.FormEvent) => {
        e.preventDefault();
        addWitness(newWitness);
        setNewWitness({ name: '', email: '' });
    };

    // Animation variants
    const cardVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.03 },
        selected: { scale: 1.05, borderColor: '#FFFFFF', borderWidth: 2 }
    };

    const specialDates = [
        { id: 'birthday', name: 'Birthday', icon: <FiGift /> },
        { id: 'graduation', name: 'Graduation', icon: <FiUser /> },
        { id: 'wedding', name: 'Wedding Anniversary', icon: <FiUsers /> },
        { id: 'retirement', name: 'Retirement', icon: <FiCalendar /> }
    ];

    // Custom time selection options
    const timeOptions = [
        { value: 60, label: '1 Hour' },
        { value: 60 * 24, label: '1 Day' },
        { value: 60 * 24 * 7, label: '1 Week' },
        { value: 60 * 24 * 30, label: '1 Month' },
        { value: 60 * 24 * 90, label: '3 Months' },
        { value: 60 * 24 * 365, label: '1 Year' },
        { value: 60 * 24 * 365 * 5, label: '5 Years' },
        { value: 60 * 24 * 365 * 10, label: '10 Years' }
    ];

    // Handle special date selection
    const handleSpecialDateSelect = (dateType: string) => {
        // This would be replaced with logic to calculate the actual date
        const today = new Date();
        let targetDate;

        switch (dateType) {
            case 'birthday':
                // Next birthday
                targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
                break;
            case 'graduation':
                // Example graduation date (June next year)
                targetDate = new Date(today.getFullYear() + 1, 5, 15);
                break;
            case 'wedding':
                // Example anniversary (6 months from now)
                targetDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
                break;
            case 'retirement':
                // Example retirement (10 years from now)
                targetDate = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
                break;
            default:
                targetDate = today;
        }

        handleChange('openDate', targetDate);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold text-foreground">When should it be opened?</h2>
                <p className="text-foreground/60 mt-2">
                    Define the conditions that will unlock your time capsule.
                </p>
            </motion.div>

            {/* Condition Type Selection */}
            <div className="mt-8">
                <h3 className="text-lg font-medium text-foreground mb-3">Choose how your capsule will be unlocked</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.div
                        whileHover="hover"
                        variants={cardVariants}
                        animate={formData.conditionType === 'time' ? 'selected' : 'idle'}
                        onClick={() => setConditionType('time')}
                        className="bg-background/30 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm cursor-pointer"
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${formData.conditionType === 'time' ? 'bg-foreground/20 text-foreground' : 'bg-foreground/10 text-foreground/50'
                                }`}>
                                <FiCalendar size={20} />
                            </div>
                            <h4 className="text-lg font-medium text-foreground">Time-Based</h4>
                        </div>
                        <p className="text-foreground/60 text-sm">
                            Open on a specific date or after a certain amount of time has passed.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover="hover"
                        variants={cardVariants}
                        animate={formData.conditionType === 'multisig' ? 'selected' : 'idle'}
                        onClick={() => setConditionType('multisig')}
                        className="bg-background/30 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm cursor-pointer"
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${formData.conditionType === 'multisig' ? 'bg-foreground/20 text-foreground' : 'bg-foreground/10 text-foreground/50'
                                }`}>
                                <FiUsers size={20} />
                            </div>
                            <h4 className="text-lg font-medium text-foreground">Multi-Signature</h4>
                        </div>
                        <p className="text-foreground/60 text-sm">
                            Open when a required number of witnesses approve.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                        whileHover="hover"
                        variants={cardVariants}
                        animate={formData.conditionType === 'oracle' ? 'selected' : 'idle'}
                        onClick={() => setConditionType('oracle')}
                        className="bg-background/30 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm cursor-pointer"
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${formData.conditionType === 'oracle' ? 'bg-foreground/20 text-foreground' : 'bg-foreground/10 text-foreground/50'}`}>
                                <FiLink size={20} />
                            </div>
                            <h4 className="text-lg font-medium text-foreground">Oracle-Based</h4>
                        </div>
                        <p className="text-foreground/60 text-sm">
                            Open when a specific external event is verified by an oracle.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover="hover"
                        variants={cardVariants}
                        animate={formData.conditionType === 'compound' ? 'selected' : 'idle'}
                        onClick={() => setConditionType('compound')}
                        className="bg-background/30 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm cursor-pointer"
                    >
                        <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${formData.conditionType === 'compound' ? 'bg-foreground/20 text-foreground' : 'bg-foreground/10 text-foreground/50'}`}>
                                <FiLayers size={20} />
                            </div>
                            <h4 className="text-lg font-medium text-foreground">Compound Conditions</h4>
                        </div>
                        <p className="text-foreground/60 text-sm">
                            Combine multiple conditions with AND/OR logic.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Condition Configuration - Time-Based */}
            {formData.conditionType === 'time' && (
                <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Select when to open the capsule</h3>

                    {/* Date Picker */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                            Choose a Specific Date
                        </label>
                        <DatePicker
                            selected={(formData.openDate as unknown as Date | null) || undefined}
                            onChange={(date) => handleChange('openDate', date)}
                            selectsRange={true}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy h:mm aa"
                            minDate={new Date()}
                            className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                        />
                        {errors.openDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.openDate}</p>
                        )}
                    </div>

                    {/* Special Dates Buttons */}
                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                            Or Select a Special Occasion
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {specialDates.map((date) => (
                                <button
                                    key={date.id}
                                    type="button"
                                    onClick={() => handleSpecialDateSelect(date.id)}
                                    className="flex items-center justify-center px-3 py-2 border border-foreground/20 rounded-md text-sm font-medium text-foreground bg-background/40 hover:bg-foreground/10"
                                >
                                    <span className="mr-2">{date.icon}</span>
                                    {date.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Options */}
                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                            Or Choose a Time from Now
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {timeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        const now = new Date();
                                        const futureDate = new Date(now.getTime() + option.value * 60000);
                                        handleChange('openDate', futureDate);
                                    }}
                                    className="flex items-center justify-center px-3 py-2 border border-foreground/20 rounded-md text-sm font-medium text-foreground bg-background/40 hover:bg-foreground/10"
                                >
                                    <span className="mr-2"><FiClock size={16} /></span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Condition Configuration - Multi-Signature */}
            {formData.conditionType === 'multisig' && (
                <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Add witnesses to approve opening</h3>

                    <div className="bg-foreground/5 p-4 rounded-lg">
                        <p className="text-sm text-foreground/60 mb-4">
                            Add people who need to approve before the capsule can be opened. At least 2 witnesses are required.
                        </p>

                        <form onSubmit={handleAddWitness} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newWitness.name}
                                        onChange={(e) => setNewWitness({ ...newWitness, name: e.target.value })}
                                        className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                                        Email
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="email"
                                            value={newWitness.email}
                                            onChange={(e) => setNewWitness({ ...newWitness, email: e.target.value })}
                                            className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                            placeholder="john@example.com"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newWitness.name || !newWitness.email}
                                            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-foreground/30"
                                        >
                                            <FiPlus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {errors.witnesses && (
                            <p className="text-red-500 text-sm mt-2">{errors.witnesses}</p>
                        )}
                    </div>

                    {/* Witnesses List */}
                    {formData.witnesses.length > 0 && (
                        <div className="space-y-3 mt-4">
                            <h4 className="text-sm font-medium text-foreground/80">Added Witnesses</h4>
                            <div className="space-y-2">
                                {formData.witnesses.map((witness, index) => {
                                    const witnessTyped = witness as unknown as { address?: string; name?: string; email?: string };
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between bg-foreground/5 p-3 border border-foreground/10 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-foreground/10 rounded-full p-2">
                                                    <FiUser className="text-foreground" size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{witnessTyped.name}</div>
                                                    <div className="text-foreground/60 text-sm">{witnessTyped.email}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeWitness(index)}
                                                className="text-foreground/40 hover:text-red-400"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Condition Configuration - Oracle-Based */}
            {formData.conditionType === 'oracle' && (
                <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Configure oracle verification</h3>

                    <div className="bg-foreground/5 p-4 rounded-lg">
                        <p className="text-sm text-foreground/60 mb-4">
                            Define an external event that will trigger the opening of your capsule.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">
                                    Oracle Source
                                </label>
                                <select
                                    value={formData.oracleData.source}
                                    onChange={(e) => handleChange('oracleData', { ...formData.oracleData, source: e.target.value })}
                                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                >
                                    <option value="">Select a source</option>
                                    <option value="chainlink">Chainlink</option>
                                    <option value="weather">Weather API</option>
                                    <option value="price">Price Feed</option>
                                    <option value="custom">Custom API</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-1">
                                    Event Description
                                </label>
                                <textarea
                                    value={formData.oracleData.eventDescription}
                                    onChange={(e) => handleChange('oracleData', { ...formData.oracleData, eventDescription: e.target.value })}
                                    rows={3}
                                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    placeholder="Describe the event that will trigger the capsule opening..."
                                />
                            </div>

                            {/* Oracle-specific parameters would go here */}
                            {formData.oracleData.source && (
                                <div className="border-t border-foreground/10 pt-4 mt-4">
                                    <h4 className="text-sm font-medium text-foreground/80 mb-2">Parameters</h4>

                                    {/* Different parameter fields based on the source selected */}
                                    {formData.oracleData.source === 'price' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-foreground/80 mb-1">
                                                    Token Symbol
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ETH"
                                                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-foreground/80 mb-1">
                                                    Target Price (USD)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="5000"
                                                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {errors.oracleSource && (
                            <p className="text-red-500 text-sm mt-2">{errors.oracleSource}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Condition Configuration - Compound */}
            {formData.conditionType === 'compound' && (
                <div className="mt-8 space-y-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Create compound conditions</h3>

                    <div className="bg-foreground/5 p-4 rounded-lg">
                        <p className="text-sm text-foreground/60 mb-4">
                            Build complex rules by combining multiple conditions using AND/OR logic.
                        </p>

                        <div className="border-l-4 border-foreground/20 pl-4 py-2">
                            <p className="text-sm text-foreground/80">
                                This is an advanced feature. Currently in development, coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConditionsStep;