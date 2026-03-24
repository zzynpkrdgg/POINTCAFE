import React from 'react';

const ProductIcon = ({ product, className, iconSize = "text-2xl" }) => {
    const cat = product.category || product.CategoryName;

    // Background Color Logic
    const getBgColor = (c) => {
        switch (c) {
            case 'Yiyecek': return 'bg-orange-100';
            case 'Soğuk İçecek': return 'bg-blue-100';
            case 'Sıcak İçecek': return 'bg-rose-100';
            case 'Pastane': return 'bg-pink-100';
            case 'Market': return 'bg-green-100';
            default: return 'bg-gray-100';
        }
    };

    // If image exists, render it
    if (product.image) {
        return <img src={product.image} alt={product.name} className={`${className} object-cover`} />;
    }

    // Fallback Icon Logic
    let icon = '🍴';
    switch (cat) {
        case 'Yiyecek': icon = '🍔'; break;
        case 'Soğuk İçecek': icon = '🥤'; break;
        case 'Sıcak İçecek': icon = '☕'; break;
        case 'Pastane': icon = '🍰'; break;
        case 'Market': icon = '🛒'; break;
        default: icon = '🍴'; break;
    }

    // Use dynamic background only if not overridden by className context (simplification: always use it for consistency if no bg provided)
    // Actually, let's just apply it. If parent wants to override, they can via className but bg classes might conflict. 
    // For now, consistent colorful backgrounds are what we want.
    const bgClass = getBgColor(cat);

    return (
        <div className={`${className} ${bgClass} flex items-center justify-center text-gray-800 select-none shadow-inner`}>
            <span className={`${iconSize} drop-shadow-sm filter`}>{icon}</span>
        </div>
    );
};

export default ProductIcon;
