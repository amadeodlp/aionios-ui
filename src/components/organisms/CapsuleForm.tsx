import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiCalendar, FiGift, FiLock } from 'react-icons/fi';
import { metaMaskHooks } from '@/web3/connectors';
import { createCapsuleOnChain, createMultiSigCapsuleOnChain, addCryptoAssets } from '@/services/cryptoService';

// Form Steps Components
import RecipientStep from './steps/RecipientStep';
import ConditionsStep from './steps/ConditionsStep';
import ContentsStep from './steps/ContentStep';
import ReviewStep from './steps/ReviewStep';
import SuccessStep from './steps/SuccessStep';

// Services and Utils
import { createCapsule, uploadToIPFS } from '@/services/capsuleService';
import { sendInvitations } from '@/services/notificationService';

const CapsuleForm = () => {
    // Main form state
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        // Recipient information
        recipients: [],
        isSecret: false,
        message: '',

        // Conditions
        conditionType: 'time', // 'time', 'multisig', 'oracle', 'compound'
        openDate: null,
        witnesses: [],
        oracleData: {
            source: '',
            eventDescription: '',
            parameters: {}
        },
        compoundConditions: [],

        // Contents
        textContent: '',
        files: [],
        urls: [],
        cryptoAssets: []
    });

    // Web3 connection - updated for web3-react v8
    const { useAccounts, useIsActive, useProvider } = metaMaskHooks;
    const isActive = useIsActive();
    const accounts = useAccounts();
    const provider = useProvider();
    const account = accounts ? accounts[0] : undefined;

    // Form validation state
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, x: "100%" },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: "-100%" }
    };

    // Step visibility logic
    const steps = [
        { id: 'recipient', title: 'For Whom?', icon: <FiGift /> },
        { id: 'conditions', title: 'When to Open?', icon: <FiCalendar /> },
        { id: 'contents', title: 'What to Include?', icon: <FiFile /> },
        { id: 'review', title: 'Review & Create', icon: <FiLock /> }
    ];

    // Handle changes in the form data
    const handleChange = (field: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Recipient step handlers
    const addRecipient = (recipient: unknown) => {
        setFormData(prev => ({
            ...prev,
            recipients: [...prev.recipients, recipient]
        }));
    };

    const removeRecipient = (index: number) => {
        setFormData(prev => ({
            ...prev,
            recipients: prev.recipients.filter((_, i) => i !== index)
        }));
    };

    // Condition step handlers
    const setConditionType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            conditionType: type
        }));
    };

    const addWitness = (witness: unknown) => {
        setFormData(prev => ({
            ...prev,
            witnesses: [...prev.witnesses, witness]
        }));
    };

    const removeWitness = (index: number) => {
        setFormData(prev => ({
            ...prev,
            witnesses: prev.witnesses.filter((_, i) => i !== index)
        }));
    };

    // Contents step handlers
    const addFile = (file: unknown) => {
        setFormData(prev => ({
            ...prev,
            files: [...prev.files, file]
        }));
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const addUrl = (url: unknown) => {
        setFormData(prev => ({
            ...prev,
            urls: [...prev.urls, url]
        }));
    };

    const removeUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            urls: prev.urls.filter((_, i) => i !== index)
        }));
    };

    const addCryptoAsset = (asset) => {
        setFormData(prev => ({
            ...prev,
            cryptoAssets: [...prev.cryptoAssets, asset]
        }));
    };

    const removeCryptoAsset = (index) => {
        setFormData(prev => ({
            ...prev,
            cryptoAssets: prev.cryptoAssets.filter((_, i) => i !== index)
        }));
    };

    // Navigation functions
    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Validation logic
    const validateCurrentStep = () => {
        const newErrors: any = {};

        if (currentStep === 0) {
            // Validate recipient step
            if (formData.recipients.length === 0) {
                newErrors.recipients = "Please add at least one recipient";
            }
        } else if (currentStep === 1) {
            // Validate conditions step
            if (formData.conditionType === 'time' && !formData.openDate) {
                newErrors.openDate = "Please select an opening date";
            } else if (formData.conditionType === 'multisig' && formData.witnesses.length < 2) {
                newErrors.witnesses = "Please add at least two witnesses";
            } else if (formData.conditionType === 'oracle' && !formData.oracleData.source) {
                newErrors.oracleSource = "Please specify an oracle source";
            }
        } else if (currentStep === 2) {
            // Validate contents step
            if (
                formData.textContent.trim() === '' &&
                formData.files.length === 0 &&
                formData.urls.length === 0 &&
                formData.cryptoAssets.length === 0
            ) {
                newErrors.contents = "Please add at least one item to your capsule";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setIsSubmitting(true);

        try {
            // Process files for IPFS storage
            const processedFiles = await Promise.all(
                formData.files.map(async file => {
                    const ipfsHash = await uploadToIPFS(file);
                    return { name: file.name, type: file.type, ipfsHash };
                })
            );

            // Create a content object that includes all capsule content
            const contentObj = {
                text: formData.textContent,
                files: processedFiles,
                urls: formData.urls,
                // Don't include crypto assets here as they'll be handled separately
            };

            // Upload the content object to IPFS to get a single hash
            const contentBlob = new Blob([JSON.stringify(contentObj)], { type: 'application/json' });
            const contentFile = new File([contentBlob], 'content.json', { type: 'application/json' });
            const contentHash = await uploadToIPFS(contentFile);

            // Determine which contract function to call based on condition type
            let capsuleId;

            if (formData.conditionType === 'time') {
                // Convert date to timestamp (seconds since epoch)
                const openTime = Math.floor(new Date(formData.openDate).getTime() / 1000);

                // Create a time-based capsule using the blockchain contract
                const result = await createCapsuleOnChain({
                    title: formData.recipients[0].name + "'s Time Capsule",
                    contentHash,
                    recipient: formData.recipients[0].address,
                    openTime
                }, provider);

                capsuleId = result.id;
            }
            else if (formData.conditionType === 'multisig') {
                // Create a multi-signature capsule
                const result = await createMultiSigCapsuleOnChain({
                    title: formData.recipients[0].name + "'s Time Capsule",
                    contentHash,
                    recipient: formData.recipients[0].address,
                    witnesses: formData.witnesses,
                    requiredSignatures: formData.witnesses.length // Require all witnesses
                }, provider);

                capsuleId = result.id;
            }

            // Handle crypto assets if there are any
            if (formData.cryptoAssets.length > 0) {
                // Add assets to the capsule
                const assetResults = await addCryptoAssets(
                    capsuleId,
                    formData.cryptoAssets,
                    provider
                );

                console.log('Asset addition results:', assetResults);
            }

            // Create the complete capsule data to store off-chain
            const capsuleData = {
                id: capsuleId,
                ...formData,
                files: processedFiles,
                creator: account,
                createdAt: new Date().toISOString(),
                contentHash
            };

            // Store additional metadata in your backend
            const capsule = await createCapsule(capsuleData);

            // Send invitations to witnesses if applicable
            if (formData.conditionType === 'multisig' && !formData.isSecret) {
                await sendInvitations(formData.witnesses, capsule.id);
            }

            setIsComplete(true);
            setCurrentStep(steps.length); // Move to success step
        } catch (error) {
            console.error("Error creating capsule:", error);
            setErrors({ submit: "There was an error creating your capsule. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render the current step
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <RecipientStep
                        formData={formData}
                        handleChange={handleChange}
                        addRecipient={addRecipient}
                        removeRecipient={removeRecipient}
                        errors={errors}
                    />
                );
            case 1:
                return (
                    <ConditionsStep
                        formData={formData}
                        handleChange={handleChange}
                        setConditionType={setConditionType}
                        addWitness={addWitness}
                        removeWitness={removeWitness}
                        errors={errors}
                    />
                );
            case 2:
                return (
                    <ContentsStep
                        formData={formData}
                        handleChange={handleChange}
                        addFile={addFile}
                        removeFile={removeFile}
                        addUrl={addUrl}
                        removeUrl={removeUrl}
                        addCryptoAsset={addCryptoAsset}
                        removeCryptoAsset={removeCryptoAsset}
                        active={isActive}
                        account={account}
                        errors={errors}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        formData={formData}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                    />
                );
            case 4:
                return <SuccessStep formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="border border-foreground/10 rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm">
                    {/* Progress Header */}
                    {!isComplete && (
                        <div className="bg-foreground/10 px-6 py-4">
                            <div className="flex justify-between items-center">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`flex flex-col items-center ${index <= currentStep ? 'text-foreground' : 'text-foreground/50'
                                            }`}
                                    >
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${index < currentStep ? 'bg-accent text-foreground' : index === currentStep ? 'border border-foreground text-foreground' : 'bg-foreground/10'}
                    `}>
                                            {index < currentStep ? '✓' : step.icon}
                                        </div>
                                        <span className="text-sm font-medium">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-foreground/40 transition-all duration-300"
                                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={pageVariants}
                                transition={{ type: "tween", duration: 0.3 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {!isComplete && currentStep < steps.length && (
                        <div className="px-6 py-4 bg-foreground/5 flex justify-between">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`px-4 py-2 rounded-lg font-medium ${currentStep === 0
                                    ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
                                    : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                                    }`}
                            >
                                Back
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 rounded-lg font-medium ${isSubmitting
                                        ? 'bg-foreground/50 text-background cursor-not-allowed'
                                        : 'bg-foreground text-background hover:bg-foreground/90'
                                        }`}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Capsule'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CapsuleForm;