-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 30 sep. 2024 à 19:26
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `qcm`
--

-- --------------------------------------------------------

--
-- Structure de la table `qcm_tests`
--

CREATE TABLE `qcm_tests` (
  `testId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `published` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `qcm_tests`
--

INSERT INTO `qcm_tests` (`testId`, `userId`, `title`, `description`, `code`, `published`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'mathematic test', 'yalla courage', '8a4ea68c51', 1, '2024-09-30 15:33:24', '2024-09-30 15:34:49'),
(2, 3, 'zz', 'zz', NULL, 0, '2024-09-30 15:47:52', '2024-09-30 15:47:52');

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

CREATE TABLE `questions` (
  `questionId` int(11) NOT NULL,
  `testId` int(11) NOT NULL,
  `text` text NOT NULL,
  `option1` varchar(255) NOT NULL,
  `option2` varchar(255) NOT NULL,
  `option3` varchar(255) NOT NULL,
  `option4` varchar(255) NOT NULL,
  `correctOption` varchar(10) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `questions`
--

INSERT INTO `questions` (`questionId`, `testId`, `text`, `option1`, `option2`, `option3`, `option4`, `correctOption`, `createdAt`, `updatedAt`) VALUES
(1, 1, '1+1= ?', 'paris', 'bizete ', 'gabes', '2', 'option4', '2024-09-30 15:33:58', '2024-09-30 15:33:58'),
(2, 1, 'capital ?', '3asfa', '3asra', '3assma', '3assir', 'option3', '2024-09-30 15:34:28', '2024-09-30 15:34:41'),
(3, 2, 'maryem', 'maryemgg', 'maryem', 'maryem', 'maryem', 'option1', '2024-09-30 15:48:00', '2024-09-30 15:48:09');

-- --------------------------------------------------------

--
-- Structure de la table `reports`
--

CREATE TABLE `reports` (
  `reportId` int(11) NOT NULL,
  `testId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reports`
--

INSERT INTO `reports` (`reportId`, `testId`, `userId`, `reason`, `description`, `createdAt`) VALUES
(1, 1, 3, 'Incorrect Content', 'dd', '2024-09-30 16:05:22');

-- --------------------------------------------------------

--
-- Structure de la table `role_requests`
--

CREATE TABLE `role_requests` (
  `idRequest` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscriptionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `testId` int(11) NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `takenAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `subscriptions`
--

INSERT INTO `subscriptions` (`subscriptionId`, `userId`, `testId`, `score`, `takenAt`, `updatedAt`) VALUES
(1, 2, 1, 50.00, '2024-09-30 15:35:01', '2024-09-30 15:35:01'),
(2, 3, 1, 100.00, '2024-09-30 15:49:33', '2024-09-30 15:49:33');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`idUser`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(2, 'Mohamed Lahouel', 'mohamed.lahouel@esprit.tn', '$2y$10$RgXJNZ7lDwr3eXW0eEu/H.mQZG5XaFWvAj54qnJJ5vjHpQ97p381C', 'admin', '2024-09-30 15:31:19', '2024-09-30 16:10:21'),
(3, 'maryemk', 'maryem', '$2y$10$87zde6ub5eWgawua1wSia.crUqi7wiCpQZB7gc3DD.dr821BmWdgK', 'admin', '2024-09-30 15:46:48', '2024-09-30 15:47:33');

-- --------------------------------------------------------

--
-- Structure de la table `user_answers`
--

CREATE TABLE `user_answers` (
  `answerId` int(11) NOT NULL,
  `subscriptionId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_answers`
--

INSERT INTO `user_answers` (`answerId`, `subscriptionId`, `questionId`, `answer`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'option1', '2024-09-30 15:35:01', '2024-09-30 15:35:01'),
(2, 1, 2, 'option3', '2024-09-30 15:35:01', '2024-09-30 15:35:01'),
(3, 2, 1, 'option4', '2024-09-30 15:49:33', '2024-09-30 15:49:33'),
(4, 2, 2, 'option3', '2024-09-30 15:49:33', '2024-09-30 15:49:33');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `qcm_tests`
--
ALTER TABLE `qcm_tests`
  ADD PRIMARY KEY (`testId`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`questionId`),
  ADD KEY `testId` (`testId`);

--
-- Index pour la table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`reportId`),
  ADD KEY `testId` (`testId`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `role_requests`
--
ALTER TABLE `role_requests`
  ADD PRIMARY KEY (`idRequest`),
  ADD KEY `idUser` (`idUser`);

--
-- Index pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscriptionId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `testId` (`testId`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`answerId`),
  ADD KEY `subscriptionId` (`subscriptionId`),
  ADD KEY `questionId` (`questionId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `qcm_tests`
--
ALTER TABLE `qcm_tests`
  MODIFY `testId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `questions`
--
ALTER TABLE `questions`
  MODIFY `questionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `reports`
--
ALTER TABLE `reports`
  MODIFY `reportId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `role_requests`
--
ALTER TABLE `role_requests`
  MODIFY `idRequest` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `subscriptionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `answerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `qcm_tests`
--
ALTER TABLE `qcm_tests`
  ADD CONSTRAINT `qcm_tests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `qcm_tests` (`testId`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `qcm_tests` (`testId`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_requests`
--
ALTER TABLE `role_requests`
  ADD CONSTRAINT `role_requests_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`idUser`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`testId`) REFERENCES `qcm_tests` (`testId`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions` (`subscriptionId`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`questionId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
