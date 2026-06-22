package org.example.fitness.Control;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.example.fitness.DAO.CheckinMapper;
import org.example.fitness.entity.CheckinRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
public class CheckinControl {

    @Autowired
    private CheckinMapper checkinMapper;

    // 获取指定日期的打卡记录
    @GetMapping("/get")
    public Map<String, Object> getCheckin(@RequestParam Integer userId, @RequestParam String date) {
        Map<String, Object> result = new HashMap<>();
        LambdaQueryWrapper<CheckinRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CheckinRecord::getUserId, userId)
               .eq(CheckinRecord::getCheckinDate, date);
        CheckinRecord record = checkinMapper.selectOne(wrapper);
        result.put("code", 200);
        result.put("data", record);
        return result;
    }

    // 获取最近N天的打卡记录
    @GetMapping("/recent")
    public Map<String, Object> getRecentCheckins(@RequestParam Integer userId, @RequestParam(defaultValue = "14") int days) {
        Map<String, Object> result = new HashMap<>();
        LambdaQueryWrapper<CheckinRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CheckinRecord::getUserId, userId)
               .ge(CheckinRecord::getCheckinDate, LocalDate.now().minusDays(days))
               .orderByDesc(CheckinRecord::getCheckinDate);
        List<CheckinRecord> list = checkinMapper.selectList(wrapper);
        result.put("code", 200);
        result.put("data", list);
        return result;
    }

    // 保存/更新打卡记录
    @PostMapping("/save")
    public Map<String, Object> saveCheckin(@RequestBody CheckinRecord record) {
        Map<String, Object> result = new HashMap<>();
        // 查询是否已存在
        LambdaQueryWrapper<CheckinRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CheckinRecord::getUserId, record.getUserId())
               .eq(CheckinRecord::getCheckinDate, record.getCheckinDate());
        CheckinRecord existing = checkinMapper.selectOne(wrapper);

        if (existing != null) {
            // 更新
            record.setId(existing.getId());
            checkinMapper.updateById(record);
        } else {
            // 新增
            checkinMapper.insert(record);
        }
        result.put("code", 200);
        result.put("message", "保存成功");
        return result;
    }
}
