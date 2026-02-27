-- SQL Server Schema for Employee Self-Service Portal

-- 1. Departments Table
CREATE TABLE Departments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) UNIQUE NOT NULL,
    IsPortalEnabled BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Roles Table
CREATE TABLE Roles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) UNIQUE NOT NULL -- admin, manager, lead, employee
);

-- 3. Teams Table
CREATE TABLE Teams (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    DepartmentId INT FOREIGN KEY REFERENCES Departments(Id)
);

-- 4. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    RoleId INT FOREIGN KEY REFERENCES Roles(Id),
    DepartmentId INT FOREIGN KEY REFERENCES Departments(Id),
    TeamId INT FOREIGN KEY REFERENCES Teams(Id),
    ReportsToId INT FOREIGN KEY REFERENCES Users(Id), -- Basic hierarchy
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 5. DailyTargets Table
CREATE TABLE DailyTargets (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RoleId INT NOT NULL,
    MinimumJobs INT NOT NULL,
    BonusRate DECIMAL(10,2) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- 6. DailyWorkEntries Table
CREATE TABLE DailyWorkEntries (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    WorkDate DATE DEFAULT CAST(GETDATE() AS DATE),
    JobsCompleted INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT UQ_User_Date UNIQUE (UserId, WorkDate)
);

-- 7. DailyBonus Table (Calculated automatically)
CREATE TABLE DailyBonus (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    WorkEntryId INT FOREIGN KEY REFERENCES DailyWorkEntries(Id),
    BonusAmount DECIMAL(18, 2) DEFAULT 0.00,
    WorkDate DATE NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 8. MonthlyPerformance View
GO
CREATE VIEW MonthlyPerformance AS
SELECT 
    UserId,
    YEAR(WorkDate) AS Year,
    MONTH(WorkDate) AS Month,
    SUM(JobsCompleted) AS TotalJobs,
    SUM(BonusAmount) AS TotalBonus
FROM DailyBonus db
JOIN DailyWorkEntries dwe ON db.WorkEntryId = dwe.Id
GROUP BY UserId, YEAR(WorkDate), MONTH(WorkDate);
GO

-- 9. LeaveRequests Table
CREATE TABLE LeaveRequests (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    LeaveType NVARCHAR(50), -- Annual, Sick, etc.
    Status NVARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    Reason NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 10. Announcements Table
CREATE TABLE Announcements (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    AuthorId INT FOREIGN KEY REFERENCES Users(Id),
    IsPinned BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- 11. AuditLogs Table
CREATE TABLE AuditLogs (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT,
    Action NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Initial Data Insertion
INSERT INTO Departments (Name, IsPortalEnabled) VALUES 
('Administration', 0),
('HR', 0),
('Finance', 0),
('Software', 0),
('Art', 1),
('QA', 1),
('Digitizing', 0),
('AI Research', 0);

INSERT INTO Roles (Name) VALUES 
('admin'), ('manager'), ('lead'), ('employee');

-- Seed Daily Targets for demonstration
-- Assuming Role IDs 1: admin, 2: manager, 3: lead, 4: employee
INSERT INTO DailyTargets (RoleId, MinimumJobs, BonusRate) VALUES
(4, 50, 2.00), -- Employees: 50 target, $2 bonus per job above target
(3, 60, 2.50); -- Leads: 60 target, $2.50 bonus
