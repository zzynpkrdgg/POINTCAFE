-- Tüm kullanıcıların temel bilgileri
CREATE TABLE USERS (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(30) NOT NULL,
    UserSurname VARCHAR(30) NOT NULL,
    Password VARCHAR(255) NOT NULL, -- Hash zorunlu
    Email VARCHAR(50) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(11),

    -- Soft delete
    Is_Deleted BOOLEAN DEFAULT FALSE,
    Deleted_At TIMESTAMP NULL
);
-- Müşteri alt tipi(customer)
CREATE TABLE CUSTOMER (
    UserID INT PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
-- Müşteri alt tipi(owner)
CREATE TABLE OWNER (
    UserID INT PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES USERS(UserID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
CREATE TABLE CATEGORY (
    CategoryID INT PRIMARY KEY,
    CategoryName VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE PRODUCT (
    ProductID INT PRIMARY KEY,
    CategoryID INT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    ProductPrice DECIMAL(10, 2) NOT NULL,
    TotalStock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (CategoryID) REFERENCES CATEGORY(CategoryID)
        ON DELETE RESTRICT -- Kategori silinirse, o kategoriye ait ürün olmamalı
        ON UPDATE CASCADE
);
CREATE TABLE ORDERS (
    OrderID INT PRIMARY KEY,
    UserID INT NOT NULL,
    OrderTime TIME,
    Total_Price DECIMAL(10, 2),
    OrderStatus VARCHAR(50), -- Örn: 'Sipariş Alındı', 'Hazırlanıyor', 'Teslimata Hazır'
    -- Kayıt oluşturma zamanını otomatik kaydetmek için ek bir alan
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES CUSTOMER(UserID)
        ON DELETE RESTRICT -- Müşteri silinse bile sipariş bilgisi tutulmalı
        ON UPDATE CASCADE
);
CREATE TABLE ORDER_ITEM (
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID)
        ON DELETE CASCADE -- Sipariş silinirse, sipariş kalemleri de silinsin
        ON UPDATE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID)
        ON DELETE RESTRICT -- Ürün silinemez, önce ilişkili sipariş kalemleri silinmeli
        ON UPDATE CASCADE
);
CREATE TABLE PAYMENT (
    PaymentID INT PRIMARY KEY,
    OrderID INT UNIQUE NOT NULL, -- Her siparişin tek bir ödemesi olmalı (1:1 ilişki)
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentStatus VARCHAR(50) NOT NULL, -- Örn: 'Başarılı', 'Başarısız'
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID)
        ON DELETE CASCADE -- Sipariş silinirse ödeme bilgisi de silinir
        ON UPDATE CASCADE
);