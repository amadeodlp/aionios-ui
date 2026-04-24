import React, { useState } from 'react';
import { FiPlus, FiX, FiMail, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { RecipientStepProps } from '@/types/capsule';

const RecipientStep = ({ formData, handleChange, addRecipient, removeRecipient, errors }: RecipientStepProps) => {
    const [newRecipient, setNewRecipient] = useState({
        name: '',
        email: '',
        relationship: ''
    });

    const handleAddRecipient = (e: React.FormEvent) => {
        e.preventDefault();
        addRecipient(newRecipient);
        setNewRecipient({ name: '', email: '', relationship: '' });
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold text-foreground">For whom is this gift?</h2>
                <p className="text-foreground/60 mt-2">
                    Share who will receive this time capsule. Their details will help ensure they can access it when the time comes.
                </p>
            </motion.div>

            {/* Secret toggle */}
            <div className="mt-6">
                <label className="flex items-center justify-center space-x-3 cursor-pointer">
                    <span className="text-foreground/80">Is this a secret?</span>
                    <div
                        className={`relative w-14 h-7 transition-colors duration-200 ease-in-out rounded-full ${formData.isSecret ? 'bg-foreground' : 'bg-foreground/20'}`}
                        onClick={() => handleChange('isSecret', !formData.isSecret)}
                    >
                        <div
                            className={`absolute left-1 top-1 w-5 h-5 bg-background rounded-full transition-transform duration-200 ease-in-out ${formData.isSecret ? 'transform translate-x-7' : ''}`}
                        />
                        <span className="sr-only">Enable Secret Mode</span>
                    </div>
                    {formData.isSecret ? <FiEyeOff className="text-foreground" /> : <FiEye className="text-foreground/60" />}
                </label>
                <p className="text-center text-sm text-foreground/60 mt-2">
                    {formData.isSecret
                        ? "Recipients will only know about the capsule when it's opened."
                        : "Recipients will be notified when you create this capsule."}
                </p>
            </div>

            {/* Recipients list */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">Recipients</h3>

                {errors.recipients && (
                    <div className="text-red-500 text-sm mb-2">{errors.recipients}</div>
                )}

                <div className="space-y-3">
                    {formData.recipients.map((recipient, index) => {
                        const recipientObj = recipient as unknown as { name: string; email: string; relationship: string };
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between bg-foreground/5 p-3 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-foreground/20 rounded-full flex items-center justify-center text-foreground">
                                        {recipientObj.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{recipientObj.name}</div>
                                        <div className="text-sm text-foreground/60">{recipientObj.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-foreground bg-foreground/10 px-2 py-1 rounded-full mr-2">
                                        {recipientObj.relationship}
                                    </span>
                                    <button
                                        onClick={() => removeRecipient(index)}
                                        className="text-foreground/40 hover:text-red-400"
                                    >
                                        <FiX size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Add recipient form */}
            <div className="mt-4 bg-foreground/5 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-foreground mb-3">Add a recipient</h3>
                <form onSubmit={handleAddRecipient} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-1">
                                Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="text-foreground/40" />
                                </div>
                                <input
                                    type="text"
                                    value={newRecipient.name}
                                    onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-foreground/40" />
                                </div>
                                <input
                                    type="email"
                                    value={newRecipient.email}
                                    onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-1">
                            Relationship
                        </label>
                        <select
                            value={newRecipient.relationship}
                            onChange={(e) => setNewRecipient({ ...newRecipient, relationship: e.target.value })}
                            className="block w-full pl-3 pr-10 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                            required
                        >
                            <option value="" disabled>Select relationship</option>
                            <option value="Family">Family</option>
                            <option value="Friend">Friend</option>
                            <option value="Partner">Partner</option>
                            <option value="Child">Child</option>
                            <option value="Colleague">Colleague</option>
                            <option value="Self">Self (Future Me)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        >
                            <FiPlus className="mr-2" />
                            Add Recipient
                        </button>
                    </div>
                </form>
            </div>

            {/* Personal Message */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                    Personal Message (Optional)
                </label>
                <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                    placeholder="Add a personal message to display with the invitation..."
                />
            </div>
        </div>
    );
};

export default RecipientStep;