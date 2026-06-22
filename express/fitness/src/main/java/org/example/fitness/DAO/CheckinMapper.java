package org.example.fitness.DAO;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.example.fitness.entity.CheckinRecord;

@Mapper
public interface CheckinMapper extends BaseMapper<CheckinRecord> {
}
