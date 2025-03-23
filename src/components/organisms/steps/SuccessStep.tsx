import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiCheckCircle,
    FiCopy,
    FiShare2,
    FiCalendar,
    FiUsers,
    FiLink,
    FiDownload,
    FiArrowRight,
    FiGift,
    FiMail
} from 'react-icons/fi';
import { format } from 'date-fns';

const SuccessStep = ({ formData }) => {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedId, setCopiedId] = useState(false);

    // Mock data - in a real app, these would come from the backend
    const capsuleData = {
        id: 'cap_' + Math.random().toString(36).substr(2, 9),
        txHash: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        createdAt: new Date(),
        link: `https://aionios.io/capsule/${Math.random().toString(36).substr(2, 9)}`
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return 'Not set';
        return format(new Date(date), 'MMMM d, yyyy h:mm aa');
    };

    // Handle copy to clipboard
    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (type === 'link') {
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                } else {
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    // Get condition type display text
    const getConditionDisplay = () => {
        switch (formData.conditionType) {
            case 'time':
                return `Time-based: Opens on ${formatDate(formData.openDate)}`;
            case 'multisig':
                return `Multi-signature: Requires ${formData.witnesses.length} witnesses to approve`;
            case 'oracle':
                return `Oracle-based: ${formData.oracleData.eventDescription || 'External event verification'}`;
            case 'compound':
                return 'Compound conditions: Multiple conditions combined';
            default:
                return 'Not set';
        }
    };

    // Get condition icon
    const getConditionIcon = () => {
        switch (formData.conditionType) {
            case 'time':
                return <FiCalendar className="text-foreground" size={24} />;
            case 'multisig':
                return <FiUsers className="text-foreground" size={24} />;
            case 'oracle':
                return <FiLink className="text-foreground" size={24} />;
            case 'compound':
                return <FiLink className="text-foreground" size={24} />;
            default:
                return <FiCalendar className="text-foreground" size={24} />;
        }
    };

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Success Header */}
            <motion.div variants={itemVariants} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-4">
                    <FiCheckCircle className="text-green-300" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Time Capsule Created!</h2>
                <p className="text-foreground/60 mt-2 max-w-md mx-auto">
                    Your blockchain time capsule has been successfully created and is now securely stored until the opening conditions are met.
                </p>
            </motion.div>

            {/* Capsule Info Card */}
            <motion.div variants={itemVariants} className="bg-foreground/5 rounded-lg border border-foreground/10 backdrop-blur-sm p-6">
                <div className="space-y-4">
                    {/* Capsule ID */}
                    <div className="flex items-center justify-between">
                        <span className="text-foreground/60">Capsule ID:</span>
                        <div className="flex items-center">
                            <code className="bg-foreground/10 px-2 py-1 rounded text-foreground font-mono">
                                {capsuleData.id}
                            </code>
                            <button
                                onClick={() => handleCopy(capsuleData.id, 'id')}
                                className="ml-2 text-foreground/80 hover:text-foreground transition-colors"
                            >
                                {copiedId ? (
                                    <FiCheckCircle size={18} className="text-green-300" />
                                ) : (
                                    <FiCopy size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Creation Date */}
                    <div className="flex items-center justify-between">
                        <span className="text-foreground/60">Created on:</span>
                        <span className="text-foreground">{formatDate(capsuleData.createdAt)}</span>
                    </div>

                    {/* Transaction Hash */}
                    <div className="flex items-center justify-between">
                        <span className="text-foreground/60">Transaction:</span>
                        <div className="flex items-center">
                            <code className="bg-foreground/10 px-2 py-1 rounded text-foreground font-mono truncate max-w-[180px] md:max-w-[250px]">
                                {capsuleData.txHash}
                            </code>
                            <a
                                href={`https://etherscan.io/tx/${capsuleData.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-foreground/80 hover:text-foreground transition-colors"
                            >
                                <FiArrowRight size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Open Condition */}
                    <div className="flex items-center justify-between">
                        <span className="text-foreground/60">Opens:</span>
                        <div className="flex items-center">
                            {getConditionIcon()}
                            <span className="ml-2 text-foreground">{getConditionDisplay()}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Share Card */}
            <motion.div variants={itemVariants} className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <FiShare2 className="mr-2" />
                    Share Your Time Capsule
                </h3>

                <div className="space-y-4">
                    <div className="bg-background/40 rounded-lg border border-foreground/10 p-3 flex items-center justify-between">
                        <input
                            type="text"
                            value={capsuleData.link}
                            readOnly
                            className="bg-transparent border-none focus:ring-0 text-foreground text-sm w-full"
                        />
                        <button
                            onClick={() => handleCopy(capsuleData.link, 'link')}
                            className="flex items-center space-x-1 py-1 px-3 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-md transition-colors ml-2"
                        >
                            {copiedLink ? (
                                <>
                                    <FiCheckCircle size={14} />
                                    <span className="text-sm">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <FiCopy size={14} />
                                    <span className="text-sm">Copy</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-background rounded-md transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            <span>Facebook</span>
                        </button>

                        <button className="flex items-center space-x-2 py-2 px-4 bg-blue-400 hover:bg-blue-500 text-background rounded-md transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            <span>Twitter</span>
                        </button>

                        <button className="flex items-center space-x-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-background rounded-md transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            <span>LinkedIn</span>
                        </button>

                        <button className="flex items-center space-x-2 py-2 px-4 bg-gray-700 hover:bg-gray-800 text-background rounded-md transition-colors">
                            <FiMail size={16} />
                            <span>Email</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Certificate Card */}
            <motion.div variants={itemVariants} className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm text-center">
                <FiGift className="mx-auto text-foreground mb-3" size={28} />
                <h3 className="text-lg font-medium text-foreground mb-2">Download Certificate</h3>
                <p className="text-foreground/60 text-sm mb-4">
                    Get a beautiful certificate for your time capsule that you can print or share digitally.
                </p>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                    <FiDownload className="mr-2" size={16} />
                    Download Certificate
                </button>
            </motion.div>

            {/* Next Steps */}
            <motion.div variants={itemVariants} className="pt-4 text-center">
                <h3 className="text-lg font-medium text-foreground mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm hover:border-foreground/20 hover:shadow-md transition-all">
                        <div className="w-10 h-10 mx-auto bg-foreground/10 rounded-full flex items-center justify-center mb-3">
                            <FiGift className="text-foreground" size={20} />
                        </div>
                        <h4 className="font-medium text-foreground mb-1">Create Another</h4>
                        <p className="text-foreground/60 text-sm">
                            Create more time capsules for different occasions and recipients.
                        </p>
                    </div>

                    <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm hover:border-foreground/20 hover:shadow-md transition-all">
                        <div className="w-10 h-10 mx-auto bg-foreground/10 rounded-full flex items-center justify-center mb-3">
                            <FiUsers className="text-foreground" size={20} />
                        </div>
                        <h4 className="font-medium text-foreground mb-1">Invite Friends</h4>
                        <p className="text-foreground/60 text-sm">
                            Share the AIONIOS experience with your friends and family.
                        </p>
                    </div>

                    <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10 backdrop-blur-sm hover:border-foreground/20 hover:shadow-md transition-all">
                        <div className="w-10 h-10 mx-auto bg-foreground/10 rounded-full flex items-center justify-center mb-3">
                            <FiCalendar className="text-foreground" size={20} />
                        </div>
                        <h4 className="font-medium text-foreground mb-1">Track Status</h4>
                        <p className="text-foreground/60 text-sm">
                            Visit your dashboard to monitor all your time capsules.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Dashboard Link */}
            <motion.div variants={itemVariants} className="text-center mt-8">
                <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-background bg-foreground hover:bg-foreground/90"
                >
                    Go to Dashboard
                    <FiArrowRight className="ml-2" size={16} />
                </a>
            </motion.div>
        </motion.div>
    );
};

export default SuccessStep;