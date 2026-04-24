import React from 'react';
import { motion } from 'framer-motion';
import {
    FiUser,
    FiUsers,
    FiFile,
    FiCalendar,
    FiDollarSign,
    FiImage,
    FiFileText,
    FiGlobe,
    FiLink,
    FiLock,
    FiChevronRight,
    FiEye
} from 'react-icons/fi';
import { format } from 'date-fns';
import { ReviewStepProps } from '@/types/capsule';

const ReviewStep = ({
    formData,
    handleSubmit,
    isSubmitting,
    errors
}: ReviewStepProps) => {
    // Format date for display
    const formatDate = (date: unknown): string => {
        if (!date) return 'Not set';
        return format(new Date(date as string | number | Date), 'MMMM d, yyyy h:mm aa');
    };

    // Format file size
    const formatFileSize = (bytes: unknown): string => {
        const bytesNum = bytes as number;
        if (bytesNum < 1024) return bytesNum + ' bytes';
        else if (bytesNum < 1048576) return (bytesNum / 1024).toFixed(1) + ' KB';
        else return (bytesNum / 1048576).toFixed(1) + ' MB';
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

    // Summary counters
    const totalContentItems =
        (formData.textContent ? 1 : 0) +
        formData.files.length +
        formData.urls.length +
        formData.cryptoAssets.length;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl font-bold text-foreground">Review Your Time Capsule</h2>
                <p className="text-foreground/60 mt-2">
                    Everything looks good? Let's create your AIONIOS time capsule.
                </p>
            </motion.div>

            {errors.submit && (
                <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiEye className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-300">
                                {errors.submit}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recipients Summary */}
                <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center mr-3">
                            <FiUsers className="text-foreground" size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Recipients</h3>
                    </div>
                    <div className="space-y-2">
                        {formData.recipients.length === 0 ? (
                            <p className="text-foreground/50 text-sm">No recipients added</p>
                        ) : (
                            formData.recipients.map((recipient, index) => {
                                const recipientObj = recipient as unknown as { name: string; email?: string };
                                return (
                                    <div key={index} className="flex items-center">
                                        <FiUser className="text-foreground/60 mr-2" size={16} />
                                        <span className="text-foreground">{recipientObj.name}</span>
                                        {recipientObj.email && (
                                            <span className="text-foreground/60 text-sm ml-2">
                                                ({recipientObj.email})
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        {formData.isSecret && (
                            <div className="flex items-center mt-2 text-foreground">
                                <FiLock size={16} className="mr-2" />
                                <span className="text-sm font-medium">Secret capsule</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conditions Summary */}
                <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center mr-3">
                            <FiCalendar className="text-foreground" size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Opening Conditions</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-foreground">
                            {getConditionDisplay()}
                        </div>

                        {formData.conditionType === 'multisig' && formData.witnesses.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-foreground/60 mb-1">Witnesses:</p>
                                <div className="space-y-1">
                                    {formData.witnesses.map((witness, index) => {
                                        const witnessObj = witness as unknown as { name: string; email: string };
                                        return (
                                            <div key={index} className="flex items-center text-sm">
                                                <FiUser className="text-foreground/60 mr-2" size={14} />
                                                <span className="text-foreground mr-1">{witnessObj.name}</span>
                                                <span className="text-foreground/60 text-xs">
                                                    ({witnessObj.email})
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contents Summary */}
                <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-foreground/10 rounded-full flex items-center justify-center mr-3">
                            <FiFile className="text-foreground" size={20} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Contents</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground/60">Total items:</span>
                            <span className="font-medium text-foreground">{totalContentItems}</span>
                        </div>
                        {formData.textContent && (
                            <div className="flex items-center">
                                <FiFileText className="text-foreground/60 mr-2" size={16} />
                                <span className="text-foreground">Message</span>
                            </div>
                        )}
                        {formData.files.length > 0 && (
                            <div className="flex items-center">
                                <FiImage className="text-foreground/60 mr-2" size={16} />
                                <span className="text-foreground">{formData.files.length} file(s)</span>
                            </div>
                        )}
                        {formData.urls.length > 0 && (
                            <div className="flex items-center">
                                <FiGlobe className="text-foreground/60 mr-2" size={16} />
                                <span className="text-foreground">{formData.urls.length} link(s)</span>
                            </div>
                        )}
                        {formData.cryptoAssets.length > 0 && (
                            <div className="flex items-center">
                                <FiDollarSign className="text-foreground/60 mr-2" size={16} />
                                <span className="text-foreground">{formData.cryptoAssets.length} crypto asset(s)</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Content Preview */}
            <div className="mt-10">
                <h3 className="text-xl font-medium text-foreground mb-4">Time Capsule Details</h3>

                {/* Text Content Preview */}
                {formData.textContent && (
                    <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm mb-6">
                        <h4 className="flex items-center text-lg font-medium text-foreground mb-3">
                            <FiFileText className="mr-2 text-foreground" />
                            Message
                        </h4>
                        <div className="border-l-4 border-foreground/20 pl-4 py-2 text-foreground/80">
                            {formData.textContent.length > 200
                                ? formData.textContent.substring(0, 200) + '...'
                                : formData.textContent}
                        </div>
                    </div>
                )}

                {/* Files Preview */}
                {formData.files.length > 0 && (
                    <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm mb-6">
                        <h4 className="flex items-center text-lg font-medium text-foreground mb-3">
                            <FiFile className="mr-2 text-foreground" />
                            Files
                        </h4>
                        <div className="space-y-2">
                            {formData.files.map((file, index) => {
                                const fileObj = file as unknown as { name: string; size: number; type?: string };
                                return (
                                    <div key={index} className="flex items-center justify-between bg-foreground/10 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            {fileObj.type?.startsWith('image/')
                                                ? <FiImage className="text-foreground mr-3" size={20} />
                                                : <FiFile className="text-foreground/60 mr-3" size={20} />
                                            }
                                            <div>
                                                <div className="font-medium text-foreground truncate max-w-[200px]">{fileObj.name}</div>
                                                <div className="text-xs text-foreground/60">{formatFileSize(fileObj.size)}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded-full">
                                            Ready
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* URLs Preview */}
                {formData.urls.length > 0 && (
                    <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm mb-6">
                        <h4 className="flex items-center text-lg font-medium text-foreground mb-3">
                            <FiLink className="mr-2 text-foreground" />
                            Links
                        </h4>
                        <div className="space-y-2">
                            {formData.urls.map((url, index) => {
                                const urlObj = url as unknown as { title: string; url: string };
                                return (
                                    <div key={index} className="flex items-center justify-between bg-foreground/10 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <FiGlobe className="text-foreground mr-3" size={20} />
                                            <div>
                                                <div className="font-medium text-foreground">{urlObj.title}</div>
                                                <div className="text-xs text-foreground/60 truncate max-w-[250px]">{urlObj.url}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Crypto Assets Preview */}
                {formData.cryptoAssets.length > 0 && (
                    <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 backdrop-blur-sm mb-6">
                        <h4 className="flex items-center text-lg font-medium text-foreground mb-3">
                            <FiDollarSign className="mr-2 text-foreground" />
                            Crypto Assets
                        </h4>
                        <div className="space-y-2">
                            {formData.cryptoAssets.map((asset, index) => {
                                const assetObj = asset as unknown as {
                                    amount: string | number;
                                    type: string;
                                    token?: string;
                                };
                                return (
                                    <div key={index} className="flex items-center justify-between bg-foreground/10 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <FiDollarSign className="text-foreground mr-3" size={20} />
                                            <div>
                                                <div className="font-medium text-foreground">
                                                    {assetObj.amount} {assetObj.type}
                                                    {assetObj.type !== 'ETH' && assetObj.token && (
                                                        <span className="text-xs text-foreground/60 ml-1">
                                                            ({assetObj.token.slice(0, 6)}...{assetObj.token.slice(-4)})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Button */}
            <div className="mt-10 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`
                        flex items-center justify-center px-6 py-3 rounded-lg font-medium text-background
                        ${isSubmitting ? 'bg-foreground/50 cursor-not-allowed' : 'bg-foreground hover:bg-foreground/90'}
                        shadow-lg transition-colors duration-200
                    `}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating your time capsule...
                        </>
                    ) : (
                        <>
                            Create AIONIOS Time Capsule
                            <FiChevronRight className="ml-2" size={20} />
                        </>
                    )}
                </button>
            </div>

            {/* Final note */}
            <div className="mt-6 text-center text-foreground/50 text-sm">
                <p>By creating this time capsule, you're agreeing to the terms of service and privacy policy.</p>
                <p className="mt-1">
                    Your content will be securely stored on the blockchain until the opening conditions are met.
                </p>
            </div>
        </div>
    );
};

export default ReviewStep;