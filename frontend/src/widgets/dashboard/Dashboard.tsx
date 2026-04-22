/**
 * @description Виджет дашборда. Загружает спринты и задачи выбранного пользователя.
 */
"use client";

import { closestCorners, DndContext } from "@dnd-kit/core";
import { Alert, Box, CircularProgress, FormGroup, Typography } from "@mui/material";
import { useDashboard } from "./model/useDashboard";
import { CreateTaskDialog } from "./ui/CreateTaskDialog";
import { DashboardFilters } from "./ui/DashboardFilters";
import { DayColumn } from "./ui/DayColumn";

export const Dashboard = () => {
  const {
    days,
    daysTasks,
    error,
    handleCloseCreateModal,
    handleCreateTask,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleOpenCreateModal,
    isCreateModalOpen,
    isCreatingTask,
    isLoadingSprints,
    isLoadingTasks,
    newTaskDate,
    newTaskTitle,
    selectedSprint,
    selectedYear,
    sensors,
    sprintOptions,
    sprintSummary,
    yearOptions,
    setNewTaskDate,
    setNewTaskTitle,
    setSelectedSprint,
    setSelectedYear,
  } = useDashboard();

  return (
    <Box sx={{ display: "grid", gap: 3, mt: 2 }}>
      <DashboardFilters
        yearOptions={yearOptions}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        sprintOptions={sprintOptions}
        selectedSprint={selectedSprint}
        isLoadingSprints={isLoadingSprints}
        onSprintChange={setSelectedSprint}
        onCreateTaskClick={handleOpenCreateModal}
        isCreateTaskDisabled={!selectedSprint || !days.length}
      />

      {sprintSummary && (
        <Typography color="text.secondary">{sprintSummary}</Typography>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <CreateTaskDialog
        open={isCreateModalOpen}
        title={newTaskTitle}
        date={newTaskDate}
        isSubmitting={isCreatingTask}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateTask}
        onTitleChange={setNewTaskTitle}
        onDateChange={setNewTaskDate}
      />

      {isLoadingTasks ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <FormGroup>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {days.map((day) => (
                <DayColumn key={day} day={day} tasks={daysTasks[day] ?? []} />
              ))}
            </Box>
          </FormGroup>
        </DndContext>
      )}
    </Box>
  );
};
