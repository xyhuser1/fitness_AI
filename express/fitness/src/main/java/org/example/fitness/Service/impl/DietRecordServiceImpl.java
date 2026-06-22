package org.example.fitness.Service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.fitness.DAO.DietMapper;
import org.example.fitness.Service.DietRecordService;
import org.example.fitness.entity.DietRecord;
import org.springframework.stereotype.Service;

@Service
public class DietRecordServiceImpl extends ServiceImpl<DietMapper, DietRecord> implements DietRecordService {

}
