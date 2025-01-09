import {
	Card,
	CardContent,
	Typography,
	Chip,
	Box,
	Modal,
	Divider,
	IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./SpellCard.module.css";
import { useState } from "react";

const SpellCard = ({ spell }) => {
	const [open, setOpen] = useState(false);
	console.log(spell);

	const getSchoolColor = (school) => {
		const schoolColors = {
			Abjuration: "#4299e1",
			Conjuration: "#9f7aea",
			Divination: "#38b2ac",
			Enchantment: "#ed64a6",
			Evocation: "#f56565",
			Illusion: "#667eea",
			Necromancy: "#1a202c",
			Transmutation: "#48bb78",
		};
		return schoolColors[school] || "#718096";
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Card
				className={styles.spellCard}
				sx={{
					bgcolor: "#1a1a1a",
					position: "relative",
					cursor: "pointer",
				}}
				onClick={handleOpen}>
				<Box
					sx={{
						bgcolor: getSchoolColor(spell.school.name),
						p: 1,
						borderBottom: "2px solid rgba(255,255,255,0.1)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Typography
						variant='subtitle2'
						sx={{
							fontWeight: "bold",
							fontSize: "1rem",
							color: "white",
							flex: 1,
							textAlign: "left",
							ml: 1,
						}}>
						{spell.name}
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							border: "2px solid #333",
							borderRadius: "5px",
							padding: "5px",
							bgcolor: "black",
						}}>
						<Typography
							variant='subtitle2'
							sx={{
								fontWeight: "bold",
								fontSize: "0.7rem",
								color: "white",
								marginRight: "2px",
							}}>
							Level
						</Typography>
						<Typography
							variant='subtitle2'
							sx={{
								fontWeight: "bold",
								fontSize: "0.7rem",
								color: "white",
								height: "20px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							{spell.level === 0 ? "C" : spell.level}
						</Typography>
					</Box>
				</Box>

				<CardContent sx={{ p: "8px !important" }}>
					<Box
						sx={{
							my: 2,
							display: "flex",
							flexDirection: "row",
							gap: "auto",
							justifyContent: "space-around",
							alignItems: "center",
							alignContent: "center",
						}}>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.65,
								fontSize: "0.75rem",
							}}>
							<AccessTimeIcon sx={{ fontSize: "0.75rem" }} />
							{spell.casting_time}
						</Typography>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.65,
								fontSize: "0.75rem",
							}}>
							<HourglassEmptyIcon sx={{ fontSize: "0.75rem" }} />
							{spell.duration}
						</Typography>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.65,
								fontSize: "0.75rem",
							}}>
							<GpsFixedIcon sx={{ fontSize: "0.75rem" }} />
							{spell.range}
						</Typography>
					</Box>
				</CardContent>
			</Card>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='spell-modal-title'
				aria-describedby='spell-modal-description'>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: { xs: "90%", sm: "600px" },
						maxHeight: { xs: "70vh", sm: "90vh" },
						bgcolor: "#1a1a1a",
						border: "2px solid #333",
						borderRadius: 2,
						boxShadow: 24,
						display: "flex",
						flexDirection: "column",
					}}>
					<Box
						sx={{
							bgcolor: getSchoolColor(spell.school.name),
							p: 2,
							borderTopLeftRadius: 8,
							borderTopRightRadius: 8,
							position: "sticky",
							top: 0,
							zIndex: 1,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexShrink: 0,
						}}>
						<Typography variant='h5' component='h2' sx={{ color: "white" }}>
							{spell.name}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Chip
								label={spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
								sx={{
									bgcolor: "black",
									color: "white",
									fontWeight: "bold",
								}}
							/>
							<IconButton
								onClick={handleClose}
								sx={{
									color: "white",
									"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
								}}>
								<CloseIcon />
							</IconButton>
						</Box>
					</Box>

					<Box
						sx={{
							overflowY: "auto",
							flex: 1,
							p: 4,
							"&::-webkit-scrollbar": {
								width: "8px",
							},
							"&::-webkit-scrollbar-track": {
								bgcolor: "rgba(0,0,0,0.1)",
								borderRadius: "4px",
							},
							"&::-webkit-scrollbar-thumb": {
								bgcolor: "rgba(255,255,255,0.2)",
								borderRadius: "4px",
								"&:hover": {
									bgcolor: "rgba(255,255,255,0.3)",
								},
							},
						}}>
						<Box
							sx={{
								mb: 0.5,
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								gap: { xs: 0, sm: 11 },
							}}>
							<Box>
								<Typography
									variant='subtitle1'
									sx={{ mb: 1, color: "grey.300" }}>
									<strong>School:</strong> {spell.school.name}
								</Typography>
								<Typography
									variant='subtitle1'
									sx={{ mb: 1, color: "grey.300" }}>
									<strong>Casting Time:</strong> {spell.casting_time}
								</Typography>
								{spell.classes && spell.classes.length > 0 && (
									<Typography
										variant='subtitle1'
										sx={{ mb: 1, color: "grey.300" }}>
										<strong>Classes:</strong>{" "}
										{spell.classes.map((c) => c.name).join(", ")}
									</Typography>
								)}
							</Box>
							<Box>
								<Typography
									variant='subtitle1'
									sx={{ mb: 1, color: "grey.300" }}>
									<strong>Range:</strong> {spell.range}
								</Typography>
								<Typography
									variant='subtitle1'
									sx={{ mb: 1, color: "grey.300" }}>
									<strong>Duration:</strong> {spell.duration}
								</Typography>
								<Box
									sx={{
										mb: { xs: 0.5, sm: 1 },
										display: "flex",
										flexDirection: "row",
										alignContent: "center",
									}}>
									<Typography
										variant='subtitle1'
										sx={{ mb: 1, color: "grey.300" }}>
										<strong>Components:</strong>
									</Typography>
									<Box sx={{ display: "flex", gap: 1, ml: 1 }}>
										{spell.components.map((comp) => {
											const componentNames = {
												V: "Verbal",
												S: "Somatic",
												M: "Material",
											};
											return (
												<Chip
													key={comp}
													label={comp}
													variant='outlined'
													sx={{
														color: "grey.300",
														"&:hover": {
															bgcolor: "#ffd700",
															"& .MuiChip-label": {
																color: "#000",
																content: `"${componentNames[comp]}"`,
															},
															transform: "scale(1.1)",
															transition: "all 0.2s ease-in-out",
														},
													}}
												/>
											);
										})}
									</Box>
								</Box>
							</Box>
						</Box>

						<Divider sx={{ my: 2, bgcolor: "grey.800" }} />

						<Typography
							variant='h6'
							sx={{ mb: 2, color: "grey.300", fontWeight: "bold" }}>
							Description
						</Typography>
						{spell.desc.map((paragraph, index) => (
							<Typography
								key={index}
								variant='body1'
								sx={{
									mb: 2,
									color: "grey.300",
									whiteSpace: "pre-line",
								}}>
								{paragraph}
							</Typography>
						))}

						{spell.higher_level && spell.higher_level.length > 0 && (
							<>
								<Typography
									variant='h6'
									sx={{ mt: 3, mb: 2, color: "grey.300", fontWeight: "bold" }}>
									At Higher Levels
								</Typography>
								{spell.higher_level.map((text, index) => (
									<Typography
										key={index}
										variant='body1'
										sx={{
											mb: 2,
											color: "grey.300",
											whiteSpace: "pre-line",
										}}>
										{text}
									</Typography>
								))}
							</>
						)}
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default SpellCard;
