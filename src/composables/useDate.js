import dayjs from "dayjs";
import { ref, onMounted, onUnmounted } from 'vue';
export const useDate = (formatString = 'YYYY-MM-DD HH:mm:ss') => {
    const currentTime = ref(dayjs().format(formatString));

    const updateTime = () => {
        currentTime.value = dayjs().format(formatString);
    };

    onMounted(() => {
        updateTime(); // 页面挂载后立即更新时间
        const timerId = setInterval(updateTime, 1000); // 每秒更新时间

        onUnmounted(() => {
            clearInterval(timerId); // 页面卸载前清除定时器
        });
    });

    return { currentTime };
}