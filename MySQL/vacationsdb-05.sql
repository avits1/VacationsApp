-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: מאי 10, 2020 בזמן 03:32 PM
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
(1, 'Eilat Hanuka Tour', 'eilat in hanuka isrotel and near 4 nights', 'https://cdn.eshet.com/odysseaimages/Atlantis/Maximal/7841_yam_suf_eilat_main.jpg?w=564&h=330&mode=cr', '2019-12-22', '2019-12-26', 850, 0),
(2, 'Barselona Weekly Winter1', 'barselona and catalunia places grand hotel', 'https://www.amadeus.co.il/hotelImage/14520.jpg', '2019-12-15', '2019-12-19', 1550, NULL),
(3, 'varna weekend', 'varna and sorroundimg', 'https://ldsr.sabre.co.il/resources/hotel/13336814651.png', '2019-12-26', '2019-12-29', 2000, 0),
(4, 'toskana wine villages', 'italy and toskana region', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzqWU-WM0Tz99xveHLgz_Q3r1lTyQyOYVFaVxzflV3dxxT', '2020-01-15', '2020-01-25', 2800, 0),
(5, 'tenerif weekly discount', 'tenerif island ', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTExMVFhUXFRUXGBcYFxgYHRgYGRcXFxoWF', '2020-01-18', '2020-01-28', 3280, 0);

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vac_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vac_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
