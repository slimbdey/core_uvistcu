SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users]
(
    [Id] [int] NOT NULL,
    [FullName] [nvarchar](50) NOT NULL,
    [TabNum] [nvarchar](7) NOT NULL,
    [OfficeId] [int] NULL,
    [Email] [nvarchar](256) NULL,
    [PhoneNum] [nvarchar](50) NULL,
    [ParticipateInLabour] [bit] NOT NULL,
    [MedExam] [datetime] NULL,
    [LabourSecurityExam] [datetime] NULL,
    [IndustrialSecurityExam] [datetime] NULL,
    [GotHelmet] [datetime] NULL,
    [GotSuit] [datetime] NULL,
    [GotBoots] [datetime] NULL,
    [GotCoat] [datetime] NULL,
    CONSTRAINT [PK_dbo.Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
