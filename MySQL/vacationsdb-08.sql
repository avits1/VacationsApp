-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: יוני 18, 2020 בזמן 02:48 AM
-- גרסת שרת: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacationsdb`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` smallint(6) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `password`, `role`) VALUES
(1, 'avraham', 'tsiv', 'avrahamts', '12345', 1),
(2, 'ivgeni', 'savski', 'ivgens', '1234', 3),
(3, 'ron', 'lalum', 'ronla', '12468', 2),
(5, 'moti', 'libro', 'motilib', '123456', 3),
(6, 'yakov', 'yakovian', 'yakovan', '123456', 3),
(10, 'eli', 'lalonk', 'elilonk', 'elilonk', 3);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vacations`
--

CREATE TABLE `vacations` (
  `vac_id` int(11) NOT NULL,
  `vac_desc` varchar(100) DEFAULT NULL,
  `dest` varchar(50) NOT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `follow_num` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- הוצאת מידע עבור טבלה `vacations`
--

INSERT INTO `vacations` (`vac_id`, `vac_desc`, `dest`, `pic`, `date_start`, `date_end`, `price`, `follow_num`) VALUES
(1, 'Eilat Summer Tour', 'eilat in summer isrotel and near 4 nights', 'Vac01-7841_yam_suf_eilat_main.jpg', '2020-08-02', '2020-08-05', 1850, 2),
(2, 'Barselona Weekly Summer1', 'barselona and catalunia places grand hotel', 'Vac02-Barselona-14520.jpg', '2020-08-04', '2020-08-16', 2550, 0),
(3, 'varna weekend', 'varna and sorroundimg', 'Vac03-Varna-13336814651.png', '2020-08-05', '2020-08-16', 3000, 2),
(4, 'toskana wine villages', 'italy and toskana region', 'Vac04-Toskana-WineVillages.jpg', '2020-08-10', '2020-08-18', 5800, 1),
(5, 'tenerif weekly discount', 'tenerif island ', 'Vac05-TenerifWeekly.jpg', '2020-08-17', '2020-08-23', 4280, 2),
(9, 'update vacation 9', 'tenerif road updated', 'Pic11-CanaryTours.jpg', '2020-07-25', '2020-08-05', 4500, 0),
(10, 'new toakana add', 'new toskana vilages', 'Pic06-Toskana-VillageHouses.jpg', '2020-09-07', '2020-09-16', 6600, 1),
(16, 'add vacation try', 'tenerif road', 'Pic10-TenerifRoad2.jpg', '2020-06-26', '2020-06-30', 4400, 0);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vacs_follow`
--

CREATE TABLE `vacs_follow` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vac_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- הוצאת מידע עבור טבלה `vacs_follow`
--

INSERT INTO `vacs_follow` (`id`, `user_id`, `vac_id`) VALUES
(63, 1, 1),
(64, 1, 3),
(67, 2, 1),
(61, 2, 3),
(62, 2, 4),
(68, 2, 5),
(58, 3, 5),
(66, 10, 10);

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- אינדקסים לטבלה `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vac_id`);

--
-- אינדקסים לטבלה `vacs_follow`
--
ALTER TABLE `vacs_follow`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vac-user` (`user_id`,`vac_id`) KEY_BLOCK_SIZE=22 USING BTREE,
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vac_id` (`vac_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vac_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `vacs_follow`
--
ALTER TABLE `vacs_follow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
