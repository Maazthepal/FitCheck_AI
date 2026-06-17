"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, ArrowRight, ImageIcon, AlertCircle, Zap, Eye, Shirt } from "lucide-react"
import useOutfitStore from "@/store/useOutfitStore"
import Image from "next/image"

const OUTFIT_IMAGES = [
    { src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80", rotate: -8, delay: 0 },
    { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80", rotate: 5, delay: 0.1 },
    { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80", rotate: -4, delay: 0.2 },
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&q=80", rotate: 7, delay: 0.3 },
]

const TIPS = [
    { icon: <Zap size={14} />, text: "Full body shot gets the best analysis" },
    { icon: <Eye size={14} />, text: "Stand against a plain wall for color accuracy" },
    { icon: <Shirt size={14} />, text: "Good lighting = better colour harmony score" },
    { icon: <ImageIcon size={14} />, text: "Mirror selfies work perfectly fine" },
]

export default function UploadPage() {
    const router = useRouter()
    const { setImage, setFile } = useOutfitStore()
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const onDrop = useCallback((accepted: File[], rejected: any[]) => {
        setError(null)
        if (rejected.length > 0) {
            setError("Invalid file. Please upload a JPEG, PNG or WEBP image under 10MB.")
            return
        }
        const file = accepted[0]
        if (!file) return
        setSelectedFile(file)
        setFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            setPreview(result)
            setImage(result)
        }
        reader.readAsDataURL(file)
    }, [setFile, setImage])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
    })

    const handleRemove = () => {
        setPreview(null)
        setSelectedFile(null)
        setError(null)
    }

    return (
        <main style={{ minHeight: "100vh", padding: "2rem", position: "relative", overflow: "hidden" }}>

            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.push("/")}
                style={{
                    position: "fixed", top: "2rem", left: "2rem", zIndex: 50,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #1f1f1f", borderRadius: "999px",
                    padding: "0.5rem 1.2rem", color: "#888",
                    cursor: "pointer", fontSize: "0.85rem",
                }}
            >
                ← Back
            </motion.button>

            {/* Ambient glow */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                <div style={{
                    position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
                    width: "600px", height: "600px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(155,93,229,0.08) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }} />
            </div>

            <div style={{
                maxWidth: "1200px", margin: "0 auto", paddingTop: "5rem",
                position: "relative", zIndex: 2,
            }}>

                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: "3rem" }}
                >
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.75rem",
                    }}>
                        Drop Your{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Fit
                        </span>
                    </h1>
                    <p style={{ color: "#555", fontSize: "1rem" }}>
                        Upload a photo and let AI break down your entire outfit
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "auto",
                    gap: "1rem",
                }}>

                    {/* LEFT COLUMN — Tilted outfit cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            gridColumn: "1",
                            display: "flex", flexDirection: "column",
                            gap: "1rem", alignItems: "center",
                            justifyContent: "center", padding: "1rem",
                        }}
                    >
                        {OUTFIT_IMAGES.slice(0, 2).map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, rotate: 0 }}
                                animate={{ opacity: 1, y: 0, rotate: img.rotate }}
                                transition={{ delay: img.delay + 0.3, duration: 0.6 }}
                                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                                style={{
                                    width: "160px", height: "200px",
                                    borderRadius: "16px", overflow: "hidden",
                                    border: "1px solid #2a2a2a",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                    cursor: "pointer", position: "relative",
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={img.src} alt="outfit"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CENTER COLUMN — Main upload + tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ gridColumn: "2", display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        {/* Dropzone or Preview */}
                        <AnimatePresence mode="wait">
                            {!preview ? (
                                <motion.div
                                    key="dropzone"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    {...getRootProps()}
                                    style={{
                                        border: `2px dashed ${isDragActive ? "#9b5de5" : "#2a2a2a"}`,
                                        borderRadius: "24px",
                                        padding: "3rem 1.5rem",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        background: isDragActive ? "rgba(155,93,229,0.05)" : "rgba(255,255,255,0.02)",
                                        transition: "all 0.2s ease",
                                        position: "relative", overflow: "hidden",
                                        minHeight: "320px",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            style={{
                                                position: "absolute", inset: 0,
                                                background: "radial-gradient(circle at center, rgba(155,93,229,0.1) 0%, transparent 70%)",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    )}
                                    <motion.div
                                        animate={{ y: isDragActive ? -8 : 0 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        style={{
                                            width: "72px", height: "72px", borderRadius: "20px",
                                            background: "rgba(155,93,229,0.15)",
                                            border: "1px solid rgba(155,93,229,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        <Upload size={30} color="#9b5de5" />
                                    </motion.div>
                                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
                                        {isDragActive ? "Drop it here 🔥" : "Drag & drop your photo"}
                                    </p>
                                    <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "1.5rem" }}>
                                        or click to browse files
                                    </p>
                                    <div style={{
                                        display: "inline-flex", gap: "0.5rem",
                                        padding: "0.4rem 1rem", borderRadius: "999px",
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid #2a2a2a",
                                        fontSize: "0.75rem", color: "#555",
                                        alignItems: "center",
                                    }}>
                                        <ImageIcon size={12} /> JPEG · PNG · WEBP · Max 10MB
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    style={{
                                        borderRadius: "24px", overflow: "hidden",
                                        border: "1px solid #1f1f1f", position: "relative",
                                        minHeight: "320px",
                                    }}
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={handleRemove}
                                        style={{
                                            position: "absolute", top: "1rem", right: "1rem", zIndex: 10,
                                            width: "36px", height: "36px", borderRadius: "50%",
                                            border: "none", background: "rgba(0,0,0,0.7)",
                                            backdropFilter: "blur(10px)", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                                        }}
                                    >
                                        <X size={16} />
                                    </motion.button>
                                    <div style={{ position: "relative", width: "100%", height: "320px" }}>
                                        <img
                                            src={preview} alt="outfit preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <div style={{
                                            position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
                                            background: "linear-gradient(transparent, rgba(8,8,8,0.9))",
                                        }} />
                                    </div>
                                    <div style={{
                                        padding: "1rem 1.5rem", background: "#0e0e0e",
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                    }}>
                                        <div>
                                            <p style={{ fontSize: "0.85rem", color: "white", fontWeight: 600 }}>
                                                {selectedFile?.name}
                                            </p>
                                            <p style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.2rem" }}>
                                                {selectedFile ? (selectedFile.size / 1024).toFixed(0) + " KB" : ""}
                                            </p>
                                        </div>
                                        <div style={{
                                            width: "8px", height: "8px", borderRadius: "50%",
                                            background: "#22c55e", boxShadow: "0 0 8px #22c55e",
                                        }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{
                                        padding: "0.75rem 1rem", borderRadius: "12px",
                                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                                        display: "flex", alignItems: "center", gap: "0.5rem",
                                        fontSize: "0.85rem", color: "#f87171",
                                    }}
                                >
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Analyze button */}
                        <AnimatePresence>
                            {preview && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(155,93,229,0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push("/analyzing")}
                                    style={{
                                        width: "100%", padding: "1.1rem",
                                        fontSize: "1.05rem", fontWeight: 700,
                                        borderRadius: "16px", border: "none", cursor: "pointer",
                                        background: "linear-gradient(135deg, #9b5de5 0%, #f15bb5 100%)",
                                        color: "white", boxShadow: "0 0 30px rgba(155,93,229,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                    }}
                                >
                                    Analyze My Fit <ArrowRight size={18} />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Pro tip */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                            style={{
                                padding: "0.75rem 1rem", borderRadius: "12px",
                                background: "rgba(155,93,229,0.06)",
                                border: "1px solid rgba(155,93,229,0.15)",
                                fontSize: "0.8rem",
                                display: "flex", gap: "0.5rem", alignItems: "flex-start",
                            }}
                        >
                            <span style={{ color: "#9b5de5", fontWeight: 700, flexShrink: 0 }}>Pro tip:</span>
                            <span style={{ color: "#555", lineHeight: 1.6 }}>
                                Stand against a plain empty wall with good lighting for the most accurate colour harmony and fit analysis.
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN — More tilted cards + tips */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            gridColumn: "3",
                            display: "flex", flexDirection: "column",
                            gap: "1rem", alignItems: "center",
                            justifyContent: "center", padding: "1rem",
                        }}
                    >
                        {OUTFIT_IMAGES.slice(2, 4).map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, rotate: 0 }}
                                animate={{ opacity: 1, y: 0, rotate: img.rotate }}
                                transition={{ delay: img.delay + 0.3, duration: 0.6 }}
                                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                                style={{
                                    width: "160px", height: "200px",
                                    borderRadius: "16px", overflow: "hidden",
                                    border: "1px solid #2a2a2a",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                    cursor: "pointer", position: "relative", flexShrink: 0,
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt="outfit"
                                    fill
                                    unoptimized
                                    style={{ objectFit: "cover" }}
                                />
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Tips row — bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "0.75rem",
                        marginTop: "1.5rem",
                    }}
                >
                    {TIPS.map((tip, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            style={{
                                padding: "0.85rem 1rem",
                                borderRadius: "14px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid #1a1a1a",
                                display: "flex", alignItems: "center", gap: "0.6rem",
                                fontSize: "0.78rem", color: "#555",
                            }}
                        >
                            <span style={{ color: "#9b5de5", flexShrink: 0 }}>{tip.icon}</span>
                            {tip.text}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
    )
}