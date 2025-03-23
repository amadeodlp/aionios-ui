import React, { useState, useRef, useEffect } from 'react';
import { FiFile, FiLink, FiUpload, FiX, FiDollarSign, FiImage, FiFileText, FiGlobe, FiClock, FiLayers, FiLock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { metaMask, metaMaskHooks } from '@/web3/connectors';
import { CONTRACT_ADDRESSES } from '@/web3/config';
import TimeCapsuleABI from '@/web3/abis/TimeCapsule.json'; // You'll need to create this ABI file

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = metaMaskHooks;

const ContentsStep = ({
    formData,
    handleChange,
    addFile,
    removeFile,
    addUrl,
    removeUrl,
    addCryptoAsset,
    removeCryptoAsset,
    active,
    account,
    errors
}) => {
    const [newUrl, setNewUrl] = useState({ title: '', url: '' });
    const [newCryptoAsset, setNewCryptoAsset] = useState({
        type: 'ETH',
        amount: '',
        token: '',
        transferType: 'immediate', // 'immediate' or 'conditional'
        condition: formData.conditionType // Inherit condition from the capsule
    });
    const [walletBalance, setWalletBalance] = useState('0');
    const [isWalletConnecting, setIsWalletConnecting] = useState(false);

    const fileInputRef = useRef(null);
    const chainId = useChainId();
    const accounts = useAccounts();
    const isActivating = useIsActivating();
    const isActive = useIsActive();
    const provider = useProvider();

    const walletAccount = accounts ? accounts[0] : undefined;

    // Effect to check and update balance when wallet connects
    useEffect(() => {
        if (isActive && provider && walletAccount) {
            const checkBalance = async () => {
                try {
                    const balance = await provider.getBalance(walletAccount);
                    setWalletBalance(ethers.utils.formatEther(balance));
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            };

            checkBalance();
        }
    }, [isActive, provider, walletAccount]);

    const handleConnectWallet = async () => {
        if (metaMask?.activate) {
            setIsWalletConnecting(true);
            try {
                await metaMask.activate();
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            } finally {
                setIsWalletConnecting(false);
            }
        }
    };

    const handleUrlAdd = (e) => {
        e.preventDefault();
        if (newUrl.url && newUrl.title) {
            addUrl(newUrl);
            setNewUrl({ title: '', url: '' });
        }
    };

    const handleCryptoAdd = async (e) => {
        e.preventDefault();
        if (newCryptoAsset.amount > 0 && isActive) {
            try {
                // If immediate transfer type is selected and it's ETH
                if (newCryptoAsset.transferType === 'immediate' && newCryptoAsset.type === 'ETH') {
                    // Pre-approval is not needed for native ETH
                    // The actual transfer will happen when creating the capsule
                    addCryptoAsset(newCryptoAsset);
                }
                // If it's a conditional transfer (for opening time)
                else if (newCryptoAsset.transferType === 'conditional') {
                    // For ETH, we'll just add it to the form for now - actual locking will happen on capsule creation
                    if (newCryptoAsset.type === 'ETH') {
                        addCryptoAsset(newCryptoAsset);
                    }
                    // For ERC20 tokens, we need to approve the contract first
                    else if (newCryptoAsset.type === 'ERC20' && newCryptoAsset.token) {
                        // Get ERC20 interface
                        const erc20Interface = new ethers.utils.Interface([
                            "function approve(address spender, uint256 amount) external returns (bool)"
                        ]);

                        // Create contract instance
                        const tokenContract = new ethers.Contract(
                            newCryptoAsset.token,
                            erc20Interface,
                            provider.getSigner()
                        );

                        // Convert amount to wei
                        const amount = ethers.utils.parseEther(newCryptoAsset.amount);

                        // Approve the capsule contract to spend tokens
                        const tx = await tokenContract.approve(CONTRACT_ADDRESSES.AIONIOS_CAPSULE, amount);
                        await tx.wait();

                        // Add the asset to the form now that it's approved
                        addCryptoAsset({
                            ...newCryptoAsset,
                            isApproved: true
                        });
                    }
                    // For NFTs, we need a different approval method
                    else if (newCryptoAsset.type === 'NFT' && newCryptoAsset.token) {
                        // Get ERC721 interface
                        const erc721Interface = new ethers.utils.Interface([
                            "function approve(address to, uint256 tokenId) external"
                        ]);

                        // Create contract instance
                        const nftContract = new ethers.Contract(
                            newCryptoAsset.token,
                            erc721Interface,
                            provider.getSigner()
                        );

                        // Approve the capsule contract for the NFT
                        const tx = await nftContract.approve(
                            CONTRACT_ADDRESSES.AIONIOS_CAPSULE,
                            newCryptoAsset.amount // tokenId for NFTs
                        );
                        await tx.wait();

                        // Add the asset to the form now that it's approved
                        addCryptoAsset({
                            ...newCryptoAsset,
                            isApproved: true
                        });
                    }
                }

                // Reset the form after adding
                setNewCryptoAsset({
                    type: 'ETH',
                    amount: '',
                    token: '',
                    transferType: 'immediate',
                    condition: formData.conditionType
                });
            } catch (error) {
                console.error("Error adding crypto asset:", error);
                // You might want to show an error message to the user
            }
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            addFile(file);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            addFile(file);
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // File type icons
    const getFileIcon = (file) => {
        const type = file.type.split('/')[0];

        switch (type) {
            case 'image':
                return <FiImage className="text-foreground" size={20} />;
            case 'video':
                return <FiFileText className="text-foreground" size={20} />;
            case 'audio':
                return <FiFileText className="text-foreground" size={20} />;
            case 'application':
                return <FiFileText className="text-foreground" size={20} />;
            default:
                return <FiFile className="text-foreground/60" size={20} />;
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // Animation variants
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
                <h2 className="text-3xl font-bold text-foreground">What would you like to include?</h2>
                <p className="text-foreground/60 mt-2">
                    Add memories, thoughts, files, links, and even crypto assets to your time capsule.
                </p>
            </motion.div>

            {errors.contents && (
                <div className="text-red-500 text-sm text-center">{errors.contents}</div>
            )}

            {/* Text Content */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">Message for the Future</h3>
                <textarea
                    value={formData.textContent}
                    onChange={(e) => handleChange('textContent', e.target.value)}
                    className="w-full p-4 min-h-[180px] border border-foreground/20 rounded-lg bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                    placeholder="Write a message, letter, story, or anything you want to preserve for the future..."
                />
            </div>

            {/* File Uploads */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                    Photos, Videos, and Other Files
                </h3>

                <div
                    className="border-2 border-dashed border-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-foreground/40 transition-colors duration-200"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                >
                    <FiUpload className="text-foreground/40 mb-2" size={36} />
                    <p className="text-foreground/60 mb-1">
                        Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-foreground/40">
                        Upload photos, videos, audio, documents, or any digital memento
                    </p>
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {/* File list */}
                <div className="mt-4">
                    {formData.files.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground/80">Uploaded Files</h4>
                            <AnimatePresence>
                                {formData.files.map((file, index) => (
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
                                            {getFileIcon(file)}
                                            <div>
                                                <div className="font-medium truncate max-w-[200px] text-foreground">{file.name}</div>
                                                <div className="text-xs text-foreground/60">{formatFileSize(file.size)}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-foreground/40 hover:text-red-400"
                                        >
                                            <FiX size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* URLs/Links */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                    Important Links
                </h3>

                <form onSubmit={handleUrlAdd} className="mb-4 bg-foreground/5 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-foreground/80 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={newUrl.title}
                                onChange={(e) => setNewUrl({ ...newUrl, title: e.target.value })}
                                className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                placeholder="My Favorite Website"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground/80 mb-1">
                                URL
                            </label>
                            <div className="flex">
                                <input
                                    type="url"
                                    value={newUrl.url}
                                    onChange={(e) => setNewUrl({ ...newUrl, url: e.target.value })}
                                    className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    placeholder="https://example.com"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                    disabled={!newUrl.url || !newUrl.title}
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* URL list */}
                <div>
                    {formData.urls.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground/80">Saved Links</h4>
                            <AnimatePresence>
                                {formData.urls.map((url, index) => (
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
                                            <FiGlobe className="text-foreground" size={20} />
                                            <div>
                                                <div className="font-medium text-foreground">{url.title}</div>
                                                <div className="text-xs text-foreground/60 truncate max-w-[250px]">{url.url}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeUrl(index)}
                                            className="text-foreground/40 hover:text-red-400"
                                        >
                                            <FiX size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Crypto Assets */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                    Include Crypto Assets
                </h3>

                {!isActive ? (
                    <div className="bg-foreground/5 p-4 rounded-lg mb-4">
                        <div className="flex flex-col items-center text-center">
                            <FiDollarSign className="text-foreground mb-2" size={24} />
                            <h4 className="font-medium text-foreground mb-1">Connect Your Wallet</h4>
                            <p className="text-sm text-foreground/60 mb-3">
                                Connect your wallet to include cryptocurrency or NFTs in your time capsule
                            </p>
                            <button
                                onClick={handleConnectWallet}
                                disabled={isWalletConnecting}
                                className="px-4 py-2 bg-foreground text-background rounded-md font-medium hover:bg-foreground/90 disabled:opacity-50"
                            >
                                {isWalletConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-foreground/5 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-foreground">Wallet Connected</h4>
                                    <p className="text-sm text-foreground/60 mt-1">
                                        {walletAccount?.slice(0, 6)}...{walletAccount?.slice(-4)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-foreground/60 text-right text-sm">Balance</p>
                                    <p className="font-medium text-foreground">{parseFloat(walletBalance).toFixed(4)} ETH</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleCryptoAdd} className="mb-4 bg-foreground/5 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                                        Asset Type
                                    </label>
                                    <select
                                        value={newCryptoAsset.type}
                                        onChange={(e) => setNewCryptoAsset({ ...newCryptoAsset, type: e.target.value })}
                                        className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    >
                                        <option value="ETH">ETH</option>
                                        <option value="ERC20">ERC-20 Token</option>
                                        <option value="NFT">NFT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                                        {newCryptoAsset.type === 'NFT' ? 'Token ID' : 'Amount'}
                                    </label>
                                    <input
                                        type={newCryptoAsset.type === 'NFT' ? 'text' : 'number'}
                                        step="0.000001"
                                        min="0"
                                        value={newCryptoAsset.amount}
                                        onChange={(e) => setNewCryptoAsset({ ...newCryptoAsset, amount: e.target.value })}
                                        className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                        placeholder={newCryptoAsset.type === 'NFT' ? 'e.g., 123' : 'e.g., 0.05'}
                                    />
                                </div>
                                {newCryptoAsset.type !== 'ETH' && (
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/80 mb-1">
                                            {newCryptoAsset.type === 'NFT' ? 'Contract Address' : 'Token Address'}
                                        </label>
                                        <input
                                            type="text"
                                            value={newCryptoAsset.token}
                                            onChange={(e) => setNewCryptoAsset({ ...newCryptoAsset, token: e.target.value })}
                                            className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                            placeholder="0x..."
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-1">
                                        Transfer Type
                                    </label>
                                    <select
                                        value={newCryptoAsset.transferType}
                                        onChange={(e) => setNewCryptoAsset({ ...newCryptoAsset, transferType: e.target.value })}
                                        className="block w-full px-3 py-2 border border-foreground/20 rounded-md bg-background/40 text-foreground focus:ring-accent focus:border-foreground"
                                    >
                                        <option value="immediate">Immediate (Transfer Now)</option>
                                        <option value="conditional">Conditional (Release When Opened)</option>
                                    </select>
                                </div>

                                {newCryptoAsset.transferType === 'conditional' && (
                                    <div className="md:col-span-2 bg-foreground/10 p-3 rounded">
                                        <div className="flex items-center mb-2">
                                            <FiLock className="text-foreground mr-2" size={16} />
                                            <span className="text-sm font-medium text-foreground">Assets will be locked until capsule is opened</span>
                                        </div>
                                        <div className="text-sm text-foreground/70">
                                            {formData.conditionType === 'time' && formData.openDate && (
                                                <p>Will be released when the capsule opens on {new Date(formData.openDate).toLocaleDateString()}</p>
                                            )}
                                            {formData.conditionType === 'multisig' && (
                                                <p>Will be released when {formData.witnesses.length} witnesses approve opening</p>
                                            )}
                                            {formData.conditionType === 'oracle' && (
                                                <p>Will be released when the specified external event occurs</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-right">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                    disabled={!newCryptoAsset.amount || (newCryptoAsset.type !== 'ETH' && !newCryptoAsset.token)}
                                >
                                    Add Asset
                                </button>
                            </div>
                        </form>

                        {/* Crypto assets list */}
                        {formData.cryptoAssets.length > 0 && (
                            <div className="space-y-2 mt-4">
                                <h4 className="text-sm font-medium text-foreground/80">Added Assets</h4>
                                <AnimatePresence>
                                    {formData.cryptoAssets.map((asset, index) => (
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
                                                <FiDollarSign className="text-foreground" size={20} />
                                                <div>
                                                    <div className="font-medium text-foreground">
                                                        {asset.amount} {asset.type}
                                                        {asset.type !== 'ETH' && asset.token && (
                                                            <span className="text-xs text-foreground/60 ml-1">
                                                                ({asset.token.slice(0, 6)}...{asset.token.slice(-4)})
                                                            </span>
                                                        )}

                                                        {asset.transferType === 'conditional' && (
                                                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent">
                                                                <FiLock className="mr-1" size={12} /> Locked until open
                                                            </span>
                                                        )}
                                                    </div>
                                                    {asset.isApproved && (
                                                        <div className="text-xs text-green-500">
                                                            ? Approved
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeCryptoAsset(index)}
                                                className="text-foreground/40 hover:text-red-400"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ContentsStep;