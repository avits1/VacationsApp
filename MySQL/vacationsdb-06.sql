-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: מאי 19, 2020 בזמן 12:14 PM
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
(4, 'roni', 'lifo', 'ronli', '12345', 3),
(5, 'moti', 'libro', 'motilib', '123456', 3),
(6, 'yakov', 'yakovian', 'yakovan', '123456', 3);

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
(1, 'Eilat Hanuka Tour', 'eilat in hanuka isrotel and near 4 nights', 'https://cdn.eshet.com/odysseaimages/Atlantis/Maximal/7841_yam_suf_eilat_main.jpg?w=564&h=330&mode=cr', '2019-12-22', '2019-12-26', 850, 3),
(2, 'Barselona Weekly Winter1', 'barselona and catalunia places grand hotel', 'https://www.amadeus.co.il/hotelImage/14520.jpg', '2019-12-15', '2019-12-19', 1550, 1),
(3, 'varna weekend', 'varna and sorroundimg', 'https://ldsr.sabre.co.il/resources/hotel/13336814651.png', '2019-12-26', '2019-12-29', 2000, 1),
(4, 'toskana wine villages', 'italy and toskana region', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzqWU-WM0Tz99xveHLgz_Q3r1lTyQyOYVFaVxzflV3dxxT', '2020-01-15', '2020-01-25', 2800, 0),
(5, 'tenerif weekly discount', 'tenerif island ', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTExMVFhUXFRUXGBcYFxgYHRgYGRcXFxoWF', '2020-01-18', '2020-01-28', 3280, 1);

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
(1, 1, 1),
(2, 2, 3),
(3, 3, 1),
(4, 4, 2),
(6, 1, 5),
(8, 2, 1);

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `vac_id` (`vac_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vac_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vacs_follow`
--
ALTER TABLE `vacs_follow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
