import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  courseEditor: {
    sections: Section[];
    isChapterModalOpen: boolean;
    isSectionModalOpen: boolean;
    isQuizModalOpen: boolean;
    selectedSectionIndex: number | null;
    selectedChapterIndex: number | null;
    selectedQuizIndex: number | null;
  };
}

const initialState: InitialStateTypes = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    isQuizModalOpen: false, 
    selectedSectionIndex: null,
    selectedChapterIndex: null,
    selectedQuizIndex: null
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.courseEditor.sections = action.payload;
    },

    // === MODALS ===
    openChapterModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null; chapterIndex: number | null }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },
    openSectionModal: (state, action: PayloadAction<{ sectionIndex: number | null }>) => {
      state.courseEditor.isSectionModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    closeSectionModal: (state) => {
      state.courseEditor.isSectionModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
    },
    openQuizModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null; chapterIndex: number | null; quizIndex: number | null }>
    ) => {
      state.courseEditor.isQuizModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
      state.courseEditor.selectedQuizIndex = action.payload.quizIndex;
    },
    closeQuizModal: (state) => {
      state.courseEditor.isQuizModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
      state.courseEditor.selectedQuizIndex = null;
    },

    // === SECTIONS ===
    addSection: (state, action: PayloadAction<Section>) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (state, action: PayloadAction<{ index: number; section: Section }>) => {
      state.courseEditor.sections[action.payload.index] = action.payload.section;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },

    // === CHAPTERS ===
    addChapter: (state, action: PayloadAction<{ sectionIndex: number; chapter: Chapter }>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(action.payload.chapter);
    },
    editChapter: (state, action: PayloadAction<{ sectionIndex: number; chapterIndex: number; chapter: Chapter }>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[action.payload.chapterIndex] = action.payload.chapter;
    },
    deleteChapter: (state, action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(action.payload.chapterIndex, 1);
    },

    // === QUIZZES ===
    addQuiz: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number; quiz: Quiz }>
    ) => {
      const { sectionIndex, chapterIndex, quiz } = action.payload;
      const chapter = state.courseEditor.sections[sectionIndex].chapters[chapterIndex];

      if (!chapter.quizzes) {
        chapter.quizzes = [];
      }

      chapter.quizzes.push(quiz);
    },

    editQuiz: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number; quizIndex: number; quiz: Quiz }>
    ) => {
      const quizzes = state.courseEditor.sections[action.payload.sectionIndex].chapters[action.payload.chapterIndex].quizzes;
      if (quizzes) {
        quizzes[action.payload.quizIndex] = action.payload.quiz;
      }
    },

    deleteQuiz: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number; quizIndex: number }>
    ) => {
      const { sectionIndex, chapterIndex, quizIndex } = action.payload;
      state.courseEditor.sections[sectionIndex].chapters[chapterIndex].quizzes?.splice(quizIndex, 1);
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  openQuizModal,
  closeQuizModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
  addQuiz,
  editQuiz,
  deleteQuiz,
} = globalSlice.actions;

export default globalSlice.reducer;
